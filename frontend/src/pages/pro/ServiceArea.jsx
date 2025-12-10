import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, MapPin, Crosshair, Plus, X, Check, Search, Map as MapIcon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// US States and Canadian Provinces list
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Ontario', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

// Major cities by state with suburbs and towns
const CITIES_BY_STATE = {
  'Texas': [
    'Houston', 'Dallas', 'Fort Worth', 'Austin', 'San Antonio', 'El Paso', 'Arlington',
    'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo',
    'Grand Prairie', 'McKinney', 'Frisco', 'Pasadena', 'Mesquite', 'Killeen', 'Waco',
    'Denton', 'Midland', 'Abilene', 'Beaumont', 'Round Rock', 'The Woodlands', 'Richardson',
    'League City', 'Allen', 'Sugar Land', 'Pearland', 'Tyler', 'Wichita Falls', 'College Station',
    'Lewisville', 'San Angelo', 'Katy', 'Pflugerville', 'Cedar Park', 'Georgetown', 'Carrollton'
  ],
  'California': [
    'Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach',
    'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista',
    'Fremont', 'San Bernardino', 'Modesto', 'Fontana', 'Oxnard', 'Moreno Valley', 'Huntington Beach',
    'Glendale', 'Santa Clarita', 'Garden Grove', 'Oceanside', 'Rancho Cucamonga', 'Santa Rosa',
    'Ontario', 'Elk Grove', 'Corona', 'Lancaster', 'Palmdale', 'Salinas', 'Pomona', 'Hayward',
    'Escondido', 'Torrance', 'Sunnyvale', 'Orange', 'Fullerton', 'Pasadena'
  ],
  'Florida': [
    'Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Port St. Lucie',
    'Tallahassee', 'Cape Coral', 'Fort Lauderdale', 'Pembroke Pines', 'Hollywood', 'Miramar',
    'Coral Springs', 'Clearwater', 'Miami Gardens', 'Palm Bay', 'West Palm Beach', 'Lakeland',
    'Pompano Beach', 'Davie', 'Boca Raton', 'Fort Myers', 'Sunrise', 'Plantation', 'Deltona',
    'Miami Beach', 'Deerfield Beach', 'Boynton Beach', 'Lauderhill', 'Weston', 'Gainesville',
    'Sarasota', 'Naples', 'Kissimmee', 'Bradenton', 'Daytona Beach', 'Port Orange'
  ],
  'New York': [
    'New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle',
    'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls',
    'Binghamton', 'Freeport', 'Valley Stream', 'Long Beach', 'Spring Valley', 'Brooklyn',
    'Queens', 'Manhattan', 'Bronx', 'Staten Island', 'Poughkeepsie', 'Newburgh', 'Middletown',
    'Port Chester', 'Jamestown', 'Ithaca', 'Auburn', 'Watertown', 'Elmira', 'Cortland'
  ],
  'Ontario': [
    'Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London', 'Markham', 'Vaughan',
    'Kitchener', 'Windsor', 'Richmond Hill', 'Oakville', 'Burlington', 'Oshawa', 'Barrie', 'St. Catharines',
    'Cambridge', 'Kingston', 'Whitby', 'Guelph', 'Ajax', 'Thunder Bay', 'Chatham', 'Waterloo',
    'Brantford', 'Pickering', 'Niagara Falls', 'Peterborough', 'Sarnia', 'Sault Ste. Marie',
    'Welland', 'Belleville', 'North Bay', 'Sudbury', 'Fort Erie', 'Cornwall', 'Timmins',
    'Woodstock', 'Stratford', 'St. Thomas', 'Orillia', 'Orangeville'
  ]
};

const ServiceArea = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [serviceAreas, setServiceAreas] = useState([]);
  const [primaryLocation, setPrimaryLocation] = useState({
    city: '',
    state: '',
    zipCode: '',
    radius: 25
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  // Get cities for selected states or show default
  const availableCities = React.useMemo(() => {
    if (selectedStates.length > 0) {
      const cities = selectedStates.flatMap(state => CITIES_BY_STATE[state] || []);
      console.log('Selected states:', selectedStates);
      console.log('Available cities for selected states:', cities);
      return cities;
    }
    const allCities = Object.values(CITIES_BY_STATE).flat();
    console.log('All available cities:', allCities.slice(0, 10), '... (showing first 10)');
    return allCities;
  }, [selectedStates]);

  const radiusOptions = [
    { value: 5, label: '5 miles - Hyperlocal', color: 'bg-green-500' },
    { value: 10, label: '10 miles - City center', color: 'bg-blue-500' },
    { value: 25, label: '25 miles - Metro area', color: 'bg-yellow-500' },
    { value: 50, label: '50 miles - Regional', color: 'bg-orange-500' },
    { value: 100, label: '100 miles - Multi-city', color: 'bg-red-500' },
    { value: 999, label: 'Entire State', color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/pro/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchServiceAreas(parsedUser.id);
  }, [navigate]);

  const fetchServiceAreas = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/pros/${userId}/profile`);
      if (response.ok) {
        const data = await response.json();
        if (data.service_areas_config) {
          setPrimaryLocation(data.service_areas_config.primary || primaryLocation);
          setSelectedStates(data.service_areas_config.states || []);
          setSelectedCities(data.service_areas_config.cities || []);
        }
      }
    } catch (error) {
      console.error('Error fetching service areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleState = (state) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleSave = async () => {
    if (!primaryLocation.city || !primaryLocation.state) {
      toast({
        title: 'Missing Information',
        description: 'Please set your primary location first',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);

    try {
      const serviceAreasConfig = {
        primary: primaryLocation,
        states: selectedStates,
        cities: selectedCities
      };

      const response = await fetch(`${API_URL}/pros/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_areas_config: serviceAreasConfig,
          location: `${primaryLocation.city}, ${primaryLocation.state}`
        })
      });

      if (response.ok) {
        toast({
          title: 'Service Areas Updated! 🎉',
          description: `You now serve ${selectedStates.length} states and ${selectedCities.length} cities with a ${primaryLocation.radius} mile radius`
        });
        
        setTimeout(() => {
          navigate('/pro/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to update service areas');
      }
    } catch (error) {
      console.error('Error saving service areas:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service areas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/pro/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Service Area Coverage</h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Coverage
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Primary Location & Radius */}
          <div className="space-y-6">
            {/* Primary Location Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Primary Location</h2>
                  <p className="text-gray-600">Where your business is based</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={primaryLocation.city}
                      onChange={(e) => setPrimaryLocation({ ...primaryLocation, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                      placeholder="Dallas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      value={primaryLocation.state}
                      onChange={(e) => setPrimaryLocation({ ...primaryLocation, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={primaryLocation.zipCode}
                    onChange={(e) => setPrimaryLocation({ ...primaryLocation, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                    placeholder="75001"
                    maxLength="5"
                  />
                </div>
              </div>
            </div>

            {/* Service Radius Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Crosshair className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Service Radius</h2>
                  <p className="text-gray-600">How far will you travel?</p>
                </div>
              </div>

              <div className="space-y-4">
                {radiusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                      primaryLocation.radius === option.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="radius"
                      value={option.value}
                      checked={primaryLocation.radius === option.value}
                      onChange={(e) => setPrimaryLocation({ ...primaryLocation, radius: parseInt(e.target.value) })}
                      className="w-5 h-5 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        <span className="font-bold text-gray-900">{option.label}</span>
                      </div>
                    </div>
                    {primaryLocation.radius === option.value && (
                      <Check className="w-5 h-5 text-red-600" />
                    )}
                  </label>
                ))}
              </div>

              {/* Visual Radius Display */}
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20"></div>
                    <div className="text-3xl font-bold text-red-600">{primaryLocation.radius}</div>
                    <div className="text-sm text-gray-600 absolute -bottom-6">miles</div>
                  </div>
                  <p className="text-sm text-gray-700 mt-8">
                    {primaryLocation.radius === 999
                      ? 'You will serve the entire state!'
                      : `You will serve customers within ${primaryLocation.radius} miles of ${primaryLocation.city || 'your location'}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - States & Cities */}
          <div className="space-y-6">
            {/* States Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <MapIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">States You Serve</h2>
                    <p className="text-gray-600">{selectedStates.length} states selected</p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                  placeholder="Search states..."
                />
              </div>

              {/* Selected States */}
              {selectedStates.length > 0 && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStates.map(state => (
                      <span
                        key={state}
                        className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {state}
                        <button
                          onClick={() => toggleState(state)}
                          className="hover:bg-green-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* States Grid */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {filteredStates.map(state => (
                    <button
                      key={state}
                      onClick={() => toggleState(state)}
                      className={`px-4 py-3 rounded-lg font-medium text-left transition ${
                        selectedStates.includes(state)
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{state}</span>
                        {selectedStates.includes(state) && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cities Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cities & Suburbs</h2>
                  <p className="text-gray-600">{selectedCities.length} locations selected</p>
                </div>
              </div>

              {selectedStates.length === 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Select states above to see cities and suburbs for those states
                  </p>
                </div>
              )}

              {/* Selected Cities */}
              {selectedCities.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCities.map(city => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {city}
                        <button
                          onClick={() => toggleCity(city)}
                          className="hover:bg-yellow-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cities Grid */}
              <div className="max-h-96 overflow-y-auto">
                {availableCities.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {availableCities.map((city, index) => (
                      <button
                        key={`${city}-${index}`}
                        onClick={() => toggleCity(city)}
                        className={`px-4 py-2 rounded-lg font-medium text-left transition ${
                          selectedCities.includes(city)
                            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{city}</span>
                          {selectedCities.includes(city) && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Select a state to see available cities and suburbs
                  </p>
                )}
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Showing:</strong> Major cities, suburbs, and towns in{' '}
                  {selectedStates.length > 0 ? selectedStates.join(', ') : 'all states'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Your Service Coverage Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Primary Location</p>
              <p className="text-2xl font-bold">
                {primaryLocation.city && primaryLocation.state
                  ? `${primaryLocation.city}, ${primaryLocation.state}`
                  : 'Not set'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Service Radius</p>
              <p className="text-2xl font-bold">
                {primaryLocation.radius === 999 ? 'Entire State' : `${primaryLocation.radius} miles`}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Total Coverage</p>
              <p className="text-2xl font-bold">
                {selectedStates.length} states, {selectedCities.length} cities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceArea;
