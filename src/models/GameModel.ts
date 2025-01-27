export interface Game {
    id: number;
    title: string;
    description: string;
    image_url: string;
    price: string;
    download_url: string | null;
    created_at: Date;
}