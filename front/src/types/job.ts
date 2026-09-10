export interface Job {
    id: number;
    title: string;
    description: string;
    cityName: string;

    latitude: number;
    longitude: number;

    employerId: number;
    status: string;
    companyName: string;
    views: number;
    createdAt: string;

    streetNumber?: number | null;
    streetName?: string | null;
    zipCode?: number | null;
}

export interface CityGroup {
    cityName: string;
    latitude: number;
    longitude: number;
    count: number;
    jobs: Job[];
}
