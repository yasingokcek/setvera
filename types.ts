export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    functionCall?: BookingFunctionCall;
}

export interface BookingFunctionCall {
    name: string;
    args: CreateBookingArgs;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreateBookingArgs {
    business_type: 'restaurant' | 'beauty' | 'other';
    customer_name: string;
    booking_summary?: string;
    start_time: string;
    end_time: string;
    special_notes?: string;
}

export type BusinessModule = 'restaurant' | 'beauty' | 'clinic';
