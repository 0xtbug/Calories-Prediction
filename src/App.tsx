import { useState } from "react";
import {
  Activity,
  Brain,
  BarChart3,
  Target,
  Clock,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  User,
  TreePine,
} from "lucide-react";
import { Toaster, toast } from "sonner";

interface PredictionData {
  Gender: number;
  Age: number;
  Height: number;
  Weight: number;
  Duration: number;
  Heart_Rate: number;
  Body_Temp: number;
}

interface PredictionResponse {
  predicted_calories: number;
  input_data: PredictionData;
}

function App() {
  const [formData, setFormData] = useState<PredictionData>({
    Gender: 1,
    Age: 25,
    Height: 170,
    Weight: 65,
    Duration: 30,
    Heart_Rate: 120,
    Body_Temp: 37.0,
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PredictionData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    const ranges = {
      Age: [10, 80],
      Height: [120, 220],
      Weight: [40, 120],
      Duration: [5, 180],
      Heart_Rate: [60, 200],
      Body_Temp: [36, 40],
      Gender: [0, 1],
    };
    for (const key in ranges) {
      const [min, max] = ranges[key as keyof typeof ranges];
      const value = formData[key as keyof typeof formData];
      if (value < min || value > max) {
        let label = "";
        switch (key) {
          case "Age":
            label = "Usia";
            break;
          case "Height":
            label = "Tinggi Badan";
            break;
          case "Weight":
            label = "Berat Badan";
            break;
          case "Duration":
            label = "Durasi";
            break;
          case "Heart_Rate":
            label = "Detak Jantung";
            break;
          case "Body_Temp":
            label = "Suhu Tubuh";
            break;
          case "Gender":
            label = "Jenis Kelamin";
            break;
          default:
            label = key;
        }
        toast.error(`${label} harus di antara ${min} sampai ${max}`);
        return;
      }
    }
    setIsLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
      <Toaster position="top-center" richColors />
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CaloriePred</h1>
              <p className="text-sm text-gray-600">
                Random Forest Calorie Prediction
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Brain className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Prediction
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Prediksi Kalori dengan
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Akurasi Tinggi
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gunakan teknologi Random Forest Regression untuk memprediksi
            pembakaran kalori berdasarkan aktivitas fisik Anda. Algoritma
            ensemble terdepan dengan akurasi mencapai 99.79%.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-500 mr-2" />
              <span>Akurasi 99.79%</span>
            </div>
            <div className="flex items-center">
              <TreePine className="h-4 w-4 text-emerald-500 mr-2" />
              <span>Random Forest</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-green-600 mr-2" />
              <span>Real-time Prediction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Random Forest Regression
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Algoritma ensemble berbasis banyak decision tree yang mampu
              menangkap hubungan non-linear dengan sangat baik untuk prediksi
              pembakaran kalori yang akurat.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <TreePine className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Performa Model Terbaik
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Random Forest menggunakan ensemble dari banyak decision tree
                untuk menghasilkan prediksi yang lebih stabil dan akurat
                dibandingkan model tunggal.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    99.79%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: "99.79%" }}
                    ></div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">R² Score</h4>
                <p className="text-sm text-gray-600">
                  Proporsi variansi yang dijelaskan model
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    8.46
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                      style={{ width: "15%" }}
                    ></div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">MSE</h4>
                <p className="text-sm text-gray-600">
                  Mean Squared Error yang sangat rendah
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    1.82
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">MAE</h4>
                <p className="text-sm text-gray-600">
                  Mean Absolute Error minimal
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Keunggulan Random Forest
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Mengurangi overfitting dengan averaging multiple trees
                    </li>
                    <li>• Mampu menangkap hubungan non-linear yang kompleks</li>
                    <li>• Robust terhadap outliers dan noise dalam data</li>
                    <li>• Memberikan prediksi yang stabil dan konsisten</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prediksi Kalori Anda
            </h2>
            <p className="text-lg text-gray-600">
              Masukkan data aktivitas fisik Anda untuk mendapatkan prediksi
              pembakaran kalori yang akurat
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  Informasi Pribadi
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.Gender}
                    onChange={(e) =>
                      handleInputChange("Gender", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={1}>Laki-laki</option>
                    <option value={0}>Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-1" /> Usia (tahun)
                  </label>
                  <input
                    type="number"
                    value={formData.Age}
                    onChange={(e) =>
                      handleInputChange("Age", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Ruler className="h-4 w-4 mr-1" /> Tinggi Badan (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.Height}
                    onChange={(e) =>
                      handleInputChange("Height", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Weight className="h-4 w-4 mr-1" /> Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.Weight}
                    onChange={(e) =>
                      handleInputChange("Weight", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="30"
                    max="200"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 text-emerald-600 mr-2" />
                  Informasi Aktivitas
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Durasi (menit)
                  </label>
                  <input
                    type="number"
                    value={formData.Duration}
                    onChange={(e) =>
                      handleInputChange("Duration", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-1" /> Detak Jantung (bpm)
                  </label>
                  <input
                    type="number"
                    value={formData.Heart_Rate}
                    onChange={(e) =>
                      handleInputChange(
                        "Heart_Rate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="60"
                    max="220"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-1" /> Suhu Tubuh (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.Body_Temp}
                    onChange={(e) =>
                      handleInputChange("Body_Temp", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="35"
                    max="42"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <TreePine className="h-5 w-5 mr-2" />
                  Prediksi Kalori
                </div>
              )}
            </button>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}

            {prediction && (
              <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Prediksi Kalori
                  </h3>
                  <div className="text-5xl font-bold text-green-600 mb-4">
                    {prediction.predicted_calories.toFixed(1)}
                  </div>
                  <p className="text-gray-600 text-lg">kalori akan terbakar</p>
                  <div className="mt-6 text-sm text-gray-500">
                    Prediksi menggunakan Random Forest Regression dengan akurasi
                    99.79%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">CaloriePred</span>
          </div>
          <p className="text-gray-400 mb-4">
            Sistem prediksi kalori menggunakan Random Forest Regression untuk
            membantu Anda memahami pembakaran kalori aktivitas fisik.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 CaloriePred. Powered by Kelompok 4 .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
