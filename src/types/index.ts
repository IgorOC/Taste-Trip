export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface TripFormData {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface Trip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  budget_category: "baixo" | "medio" | "alto";
  itinerary?: TripItinerary;
  weather_data?: WeatherData;
  local_cuisine?: LocalCuisine;
  created_at: string;
  updated_at: string;
}

export interface TripItinerary {
  days: DayPlan[];
  recommendations: {
    accommodation: string[];
    transportation: string[];
    activities: string[];
  };
  budget_breakdown: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    total: number;
  };
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  estimated_cost: number;
  category: "attraction" | "culture" | "nature" | "entertainment";
}

export interface Meal {
  time: "breakfast" | "lunch" | "dinner" | "snack";
  suggestion: string;
  location: string;
  estimated_cost: number;
}

export type WeatherData = {
  location: {
    name: string;
  };
  current: {
    temperature: number;
    description: string;
    humidity: number;
    wind_speed: number;
  };
  forecast: {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    description: string;
    precipitation: number;
  }[];
};

export interface DayWeather {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
  precipitation: number;
}

export interface LocalCuisine {
  typical_dishes: Dish[];
  local_ingredients: string[];
  food_culture: string;
  restaurant_recommendations: Restaurant[];
}

export interface Dish {
  name: string;
  description: string;
  ingredients: string[];
  recipe_summary: string;
  difficulty: "easy" | "medium" | "hard";
  preparation_time: number;
  cultural_significance: string;
}

export interface Restaurant {
  name: string;
  type: string;
  description: string;
  price_range: "baixo" | "medio" | "alto";
  specialties: string[];
}

// API Response Types
export interface OpenWeatherResponse {
  current: {
    temp: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    humidity: number;
    wind_speed: number;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
}

export interface SpoonacularResponse {
  recipes: Array<{
    id: number;
    title: string;
    summary: string;
    ingredients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
    instructions: string;
    readyInMinutes: number;
    servings: number;
  }>;
}
