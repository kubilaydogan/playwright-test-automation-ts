export interface BookingData {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: {
        checkin: string;
        checkout: string;
    };
    additionalneeds: string;
}

export interface BookingResponse {
    bookingid: number;
    booking: BookingData;
}

export interface AuthResponse {
    token: string;
}