import { useState } from 'react';
import { Activity, Brain, BarChart3, Target, Users, Clock, Heart, Thermometer, Weight, Ruler, User } from 'lucide-react';
import { Toaster, toast } from 'sonner';

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
    Body_Temp: 37.0
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PredictionData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        toast.error(`${key.replace('_', ' ')} harus di antara ${min} dan ${max}`);
        return;
      }
    }
    setIsLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const algorithms = [
    {
      name: 'Linear Regression',
      description: 'Model regresi linier sederhana sebagai baseline',
      r2: 0.9663,
      mse: 132.92,
      mae: 8.45,
      color: 'bg-blue-500'
    },
    {
      name: 'Random Forest Regression',
      description: 'Algoritma ensemble berbasis banyak decision tree',
      r2: 0.9979,
      mse: 8.46,
      mae: 1.82,
      color: 'bg-green-500'
    },
    {
      name: 'Support Vector Regression',
      description: 'Metode Support Vector Machine untuk kasus regresi',
      r2: 0.9932,
      mse: 26.80,
      mae: 2.40,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CaloriePred</h1>
              <p className="text-sm text-gray-600">Prediksi Kalori yang Akurat</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Brain className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Prediction</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Prediksi Kalori yang
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Akurat</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gunakan teknologi machine learning terdepan untuk memprediksi pembakaran kalori berdasarkan 
            aktivitas fisik Anda. Sistem kami menggunakan tiga algoritma canggih dengan akurasi hingga 99.79%.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-500 mr-2" />
              <span>Akurasi 99.79%</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500 mr-2" />
              <span>3 Model ML</span>
            </div>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
              <span>Real-time Prediction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Algoritma Pembelajaran Mesin</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tiga model machine learning tipe regresi telah diterapkan untuk membangun model prediksi kalori 
              dengan performa yang telah diuji dan divalidasi.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {algorithms.map((algo, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-12 h-12 ${algo.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Brain className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{algo.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{algo.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">R² Score</span>
                      <span className="text-sm font-bold text-gray-900">{(algo.r2 * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${algo.color}`}
                        style={{ width: `${algo.r2 * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">MSE</p>
                      <p className="text-lg font-bold text-gray-900">{algo.mse.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">MAE</p>
                      <p className="text-lg font-bold text-gray-900">{algo.mae.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prediksi Kalori Anda</h2>
            <p className="text-lg text-gray-600">
              Masukkan data aktivitas fisik Anda untuk mendapatkan prediksi pembakaran kalori yang akurat
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  Informasi Pribadi
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    value={formData.Gender}
                    onChange={(e) => handleInputChange('Gender', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={1}>Laki-laki</option>
                    <option value={0}>Perempuan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Usia (tahun)
                  </label>
                  <input 
                    type="number"
                    value={formData.Age}
                    onChange={(e) => handleInputChange('Age', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="10" max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Ruler className="h-4 w-4 mr-1" />
                    Tinggi Badan (cm)
                  </label>
                  <input 
                    type="number"
                    value={formData.Height}
                    onChange={(e) => handleInputChange('Height', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="100" max="250"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Weight className="h-4 w-4 mr-1" />
                    Berat Badan (kg)
                  </label>
                  <input 
                    type="number"
                    value={formData.Weight}
                    onChange={(e) => handleInputChange('Weight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="30" max="200"
                  />
                </div>
              </div>
              
              {/* Activity Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 text-green-600 mr-2" />
                  Informasi Aktivitas
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Durasi (menit)
                  </label>
                  <input 
                    type="number"
                    value={formData.Duration}
                    onChange={(e) => handleInputChange('Duration', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="1" max="300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    Detak Jantung (bpm)
                  </label>
                  <input 
                    type="number"
                    value={formData.Heart_Rate}
                    onChange={(e) => handleInputChange('Heart_Rate', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="60" max="220"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-1" />
                    Suhu Tubuh (°C)
                  </label>
                  <input 
                    type="number"
                    step="0.1"
                    value={formData.Body_Temp}
                    onChange={(e) => handleInputChange('Body_Temp', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min="35" max="42"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Prediksi Kalori</h3>
                  <div className="text-5xl font-bold text-green-600 mb-4">
                    {prediction.predicted_calories.toFixed(1)}
                  </div>
                  <p className="text-gray-600 text-lg">kalori akan terbakar</p>
                  <div className="mt-6 text-sm text-gray-500">
                    Prediksi menggunakan model Random Forest dengan akurasi 99.79%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">CaloriePred</span>
          </div>
          <p className="text-gray-400 mb-4">
            Sistem prediksi kalori menggunakan machine learning untuk membantu Anda memahami pembakaran kalori aktivitas fisik.
          </p>
          <p className="text-sm text-gray-500">
            © 2025 CaloriePred. Powered by Kelompok 4.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;