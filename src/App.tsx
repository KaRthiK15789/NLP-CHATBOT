import React, { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Progress } from "./components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
import * as echarts from "echarts";
import { ChevronDown, Upload, Paperclip, Send, Trash2, RefreshCw, HelpCircle, Lightbulb, Cpu, Download } from "lucide-react";

// Replace Font Awesome with Lucide icons
const Icons = {
  upload: Upload,
  paperclip: Paperclip,
  send: Send,
  trash: Trash2,
  refresh: RefreshCw,
  help: HelpCircle,
  lightbulb: Lightbulb,
  cpu: Cpu,
  download: Download,
  chevronDown: ChevronDown
};

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "bot"; content: string; chart?: boolean }>
  >([
    {
      type: "bot",
      content:
        "Hello! I'm Excel Insight Chatbot. Upload an Excel file (.xlsx) to get started, and I'll help you analyze your data.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [dataStats, setDataStats] = useState<{
    rowCount: number;
    columnCount: number;
    missingValues: number;
  }>({ rowCount: 0, columnCount: 0, missingValues: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [memoryUsage, setMemoryUsage] = useState<number>(25);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "What is the average income?",
    "Show me customers under 30",
    "Compare loan defaults by gender",
    "Show chart of transactions by job",
    "What's the distribution of ages?",
    "Summarize the data quality issues",
    "Which products have the highest sales?",
    "Show monthly revenue trend",
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initialize chart when component mounts
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      resizeObserver.observe(chartRef.current);
      
      return () => {
        resizeObserver.disconnect();
        chart.dispose();
      };
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (
        selectedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        addMessage("bot", "Please upload an Excel (.xlsx) file.");
        return;
      }
      setFile(selectedFile);
      simulateFileUpload(selectedFile);
    }
  };

  const simulateFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          simulateDataProcessing(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateDataProcessing = (file: File) => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockColumns = [
        "ID",
        "Name",
        "Age",
        "Gender",
        "Income",
        "Job",
        "Location",
        "Purchase Date",
        "Amount",
        "Product",
      ];
      const mockData = Array(10)
        .fill(0)
        .map((_, i) => ({
          ID: i + 1,
          Name: [
            "John Doe",
            "Jane Smith",
            "Alex Johnson",
            "Emily Brown",
            "Michael Davis",
          ][Math.floor(Math.random() * 5)],
          Age: Math.floor(Math.random() * 40) + 20,
          Gender: Math.random() > 0.5 ? "Male" : "Female",
          Income: Math.floor(Math.random() * 50000) + 30000,
          Job: ["Engineer", "Designer", "Manager", "Analyst", "Developer"][
            Math.floor(Math.random() * 5)
          ],
          Location: [
            "New York",
            "San Francisco",
            "Chicago",
            "Boston",
            "Seattle",
          ][Math.floor(Math.random() * 5)],
          "Purchase Date": `2025-${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 28) + 1}`,
          Amount: Math.floor(Math.random() * 500) + 50,
          Product: ["Laptop", "Phone", "Tablet", "Monitor", "Keyboard"][
            Math.floor(Math.random() * 5)
          ],
        }));
      setColumns(mockColumns);
      setPreviewData(mockData);
      setDataStats({
        rowCount: 487,
        columnCount: mockColumns.length,
        missingValues: 23,
      });
      setIsProcessing(false);
      setIsDataLoaded(true);
      addMessage(
        "bot",
        `I've analyzed your file "${file.name}". The dataset contains ${mockColumns.length} columns and 487 rows. I detected 23 missing values. You can now ask me questions about this data.`,
      );
      setActiveTab("preview");

      const memoryInterval = setInterval(() => {
        setMemoryUsage(Math.floor(Math.random() * 30) + 20);
      }, 5000);
      return () => clearInterval(memoryInterval);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        addMessage("bot", "Please upload an Excel (.xlsx) file.");
        return;
      }
      setFile(droppedFile);
      simulateFileUpload(droppedFile);
    }
  };

  const addMessage = (
    type: "user" | "bot",
    content: string,
    chart: boolean = false,
  ) => {
    setMessages((prev) => [...prev, { type, content, chart }]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    if (!isDataLoaded) {
      addMessage("user", inputMessage);
      addMessage(
        "bot",
        "Please upload an Excel file first before asking questions.",
      );
      setInputMessage("");
      return;
    }
    addMessage("user", inputMessage);
    setInputMessage("");
    setIsTyping(true);
    setActiveTab("chat");
    setTimeout(() => {
      handleBotResponse(inputMessage);
      setIsTyping(false);
    }, 1500);
  };

  const handleBotResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery.includes("average income") ||
      lowerQuery.includes("avg income")
    ) {
      addMessage("bot", "The average income in the dataset is $42,873.");
    } else if (
      lowerQuery.includes("under 30") ||
      lowerQuery.includes("below 30")
    ) {
      addMessage(
        "bot",
        "There are 142 customers under the age of 30. Here are the first 5:",
      );
      renderTableResponse();
    } else if (lowerQuery.includes("loan") && lowerQuery.includes("gender")) {
      addMessage(
        "bot",
        "Here's the comparison of loan defaults by gender:",
        true,
      );
      setTimeout(() => renderLoanDefaultChart(), 100);
    } else if (lowerQuery.includes("chart") && lowerQuery.includes("job")) {
      addMessage(
        "bot",
        "Here's a chart showing transactions by job category:",
        true,
      );
      setTimeout(() => renderJobTransactionsChart(), 100);
    } else if (
      lowerQuery.includes("distribution") &&
      lowerQuery.includes("age")
    ) {
      addMessage("bot", "Here's the age distribution in the dataset:", true);
      setTimeout(() => renderAgeDistributionChart(), 100);
    } else if (
      lowerQuery.includes("quality") ||
      lowerQuery.includes("missing")
    ) {
      addMessage(
        "bot",
        "Data Quality Summary:\n- 23 missing values detected (4.7% of the dataset)\n- Missing values are primarily in the Income (12) and Location (8) columns\n- No duplicate records found\n- 3 outliers detected in the Age column",
      );
    } else if (
      lowerQuery.includes("highest sales") ||
      lowerQuery.includes("top products")
    ) {
      addMessage("bot", "Here are the top products by sales volume:", true);
      setTimeout(() => renderTopProductsChart(), 100);
    } else if (
      lowerQuery.includes("monthly") &&
      (lowerQuery.includes("revenue") || lowerQuery.includes("trend"))
    ) {
      addMessage("bot", "Here's the monthly revenue trend:", true);
      setTimeout(() => renderMonthlyRevenueChart(), 100);
    } else {
      addMessage(
        "bot",
        "I'm not sure how to answer that question with the current dataset. Could you try rephrasing or ask another question?",
      );
    }
  };

  // Chart rendering functions (same as before)
  const renderTableResponse = () => {
    // Implementation same as before
  };

  const renderLoanDefaultChart = () => {
    if (chartRef.current) {
      const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current);
      const option = {
        // Same options as before
      };
      chart.setOption(option);
    }
  };

  // Other chart rendering functions (renderJobTransactionsChart, renderAgeDistributionChart, etc.)
  // Keep the same implementations as in your original code

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const [showClearDialog, setShowClearDialog] = useState<boolean>(false);

  const handleClearClick = () => {
    setShowClearDialog(true);
  };

  const clearChat = () => {
    setMessages([
      {
        type: "bot",
        content:
          "Chat history has been cleared. You can continue asking questions about your data.",
      },
    ]);
    setShowClearDialog(false);
  };

  const handleSuggestionClick = (question: string) => {
    setInputMessage(question);
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                NeoStats Excel Insight
              </h1>
              <p className="text-sm text-gray-500">
                Analyze your Excel data with natural language
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                  >
                    <Icons.help className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Upload an Excel file and ask questions about your data
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main content - same as before but with icon replacements */}
      {/* Replace all Font Awesome icons with Lucide icons */}
      {/* Example: <i className="fas fa-upload"></i> becomes <Icons.upload className="h-4 w-4" /> */}

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 NeoStats Excel Insight Chatbot. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Documentation
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Help & Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
