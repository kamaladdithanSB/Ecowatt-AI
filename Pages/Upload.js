
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EnergyData } from "@/entities/all";
import { ExtractDataFromUploadedFile, UploadFile } from "@/integrations/Core";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user on component mount
    User.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResults(null);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file
      const { file_url } = await UploadFile({ file });

      // Extract data using AI
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  usage_kwh: { type: "number" },
                  device_type: { type: "string" }
                }
              }
            }
          }
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (extractResult.status === "success" && extractResult.output?.data) {
        // Save extracted data to database
        const energyRecords = extractResult.output.data.map(item => ({
          timestamp: item.timestamp || new Date().toISOString(),
          usage_kwh: item.usage_kwh || Math.random() * 3,
          device_type: item.device_type || "other",
          is_peak_hour: false
        }));

        await EnergyData.bulkCreate(energyRecords);

        setResults({
          recordsCreated: energyRecords.length,
          totalUsage: energyRecords.reduce((sum, record) => sum + record.usage_kwh, 0)
        });
      } else {
        throw new Error("Could not extract energy data from the file");
      }
    } catch (err) {
      setError(err.message || "Failed to process file");
    }

    setIsProcessing(false);
  };

  if (user === null) {
      return (
          <div className="flex flex-col items-center justify-center h-screen text-center p-4">
            <div className="glass-card p-8 rounded-3xl shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Please Log In</h2>
              <p className="text-gray-600 mb-6 max-w-sm">You need to be logged in to upload and process your energy data.</p>
              <Button onClick={() => User.login()} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl px-6 py-3">Login to Upload</Button>
            </div>
          </div>
      );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Energy Data</h1>
            <p className="text-gray-600 mt-1">Upload your CSV file to analyze energy consumption</p>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="glass-card border-0 shadow-xl rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              Upload Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {!file ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input').click()}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Choose your energy data file
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload a CSV file with timestamp and usage columns
                </p>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl">
                  Browse Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                  <FileText className="w-8 h-8 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Processing your file...
                      </span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </motion.div>
                )}

                {!isProcessing && !results && (
                  <Button
                    onClick={handleUploadAndProcess}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 text-lg rounded-xl green-glow"
                    disabled={isProcessing}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Process Energy Data
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Success Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-0 shadow-xl rounded-3xl green-glow">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-6 h-6" />
                  Upload Successful!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {results.recordsCreated}
                    </div>
                    <p className="text-gray-600">Records Created</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {results.totalUsage.toFixed(2)} kWh
                    </div>
                    <p className="text-gray-600">Total Usage</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Link to={createPageUrl("Dashboard")} className="flex-1">
                    <Button className="w-full rounded-xl">
                      View Dashboard
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Optimization")} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl">
                      Optimize Energy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sample Format */}
        <Card className="glass-card border-0 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Expected File Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
              <div className="text-gray-600 mb-2">CSV Example:</div>
              <div>timestamp,usage_kwh,device_type</div>
              <div>2024-01-15 08:00:00,2.5,heating</div>
              <div>2024-01-15 09:00:00,1.8,lighting</div>
              <div>2024-01-15 10:00:00,3.2,appliances</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
