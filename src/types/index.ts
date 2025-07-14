// Trip.ts

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  budget_category: "baixo" | "medio" | "alto";
  itinerary?: TripItinerary;
  weather_data?: WeatherData;
  local_cuisine?: LocalCuisine;
}

export interface TripItinerary {
  overview?: TripOverview;
  days: TripDay[];
  final_tips?: FinalTips;
  recommendations?: TripRecommendations;
  budget_breakdown?: BudgetBreakdown;
}

export interface TripOverview {
  title: string;
  period: string;
  duration: string;
  travelers: string;
  budget_estimate: string;
  introduction: string;
}

export interface TripDay {
  day: number;
  title: string;
  morning?: {
    description: string;
    tip: string;
  };
  lunch?: {
    options: TripLunchOption[];
    tip: string;
  };
  afternoon?: {
    activity: string;
    location: string;
    duration: string;
    how_to_get: string;
    tip: string;
  };
  dinner?: {
    name: string;
    type: string;
    link: string;
  };
  night_activity?: string;
}

export interface TripLunchOption {
  name: string;
  type: string;
  link: string;
}

export interface FinalTips {
  transportation: string;
  average_meal_cost: string;
  tipping: string;
  safety: string;
  weather: string;
  money: string;
  local_culture: string;
  emergency: {
    police: string;
    hospital: string;
  };
  shopping: string;
  useful_links: {
    hotels: string;
    transport: string;
    insurance: string;
    tours: string;
  };
}

export interface TripRecommendations {
  accommodation: string[];
  transportation: string[];
  activities: string[];
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  total: number;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temperature: number;
    description: string;
    humidity: number;
    wind_speed: number;
  };
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  precipitation: number;
}

export interface LocalCuisine {
  food_culture: string;
  typical_dishes: TypicalDish[];
  local_ingredients: string[];
  restaurant_recommendations: RestaurantRecommendation[];
}

export interface TypicalDish {
  name: string;
  description: string;
  ingredients: string[];
  recipe_summary: string;
  difficulty: "easy" | "medium" | "hard";
  preparation_time: number;
  cultural_significance: string;
}

export interface RestaurantRecommendation {
  name: string;
  description: string;
  type: string;
  price_range: "baixo" | "medio" | "alto";
  specialties: string[];
}
