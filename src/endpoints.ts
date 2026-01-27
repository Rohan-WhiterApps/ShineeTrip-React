
const BASE_URL = "http://46.62.160.188:3000"

export const API_ENDPOINTS = {
  PROPERTIES: {
    AllProperties: (queryParams : string ) => `${BASE_URL}/properties/search?${queryParams}`,
    EachProperty: (id: string) => `${BASE_URL}/properties/${id}`, 
    PropertyRating: (id: string) =>`${BASE_URL}/ratings/property/${id}`,
    ServiceProdInfo: `${BASE_URL}/service-prod-info`,
    POSTRATINGS :`${BASE_URL}/ratings` , 
    Discount :(customerid: string) => `${BASE_URL}/catalog-price-rules?customerid=${customerid}` , 
  },

  ORDER : {
    CheckAvailablity: `${BASE_URL}/order/check-availability`, 
    FetchCreateOrder: `${BASE_URL}/order`,
    OrderCreate : `${BASE_URL}/order/create` , 
    SuccessOrder: `${BASE_URL}/order/success`,
    FailureOrder: `${BASE_URL}/order/failure`,
    Invoice : `${BASE_URL}/invoices`,
  }, 
  
  USER: {
    UserOrder: (id: string) => `${BASE_URL}/order?customerId=${id}`,
    HolidayPackage: (id: string) => `${BASE_URL}/holiday-package-orders?customerId=${id}` , 
    ProfileData: (id: string) => `${BASE_URL}/customers/${id}` ,
    DetailedOrders: (id: string) => `${BASE_URL}/order/search?customerId=${id}`,
  },
  
  AUTH: {
    LoginAuth: (email: string) => `${BASE_URL}/customers/0?email=${email}`,  
    SignUpAuth: `${BASE_URL}/customers`,   
    AssignRoles: (id : string) => `${BASE_URL}/firebase-auth/set-roles/${id}`,   
  }, 
  
  Contact: {
    ContactUs :  `${BASE_URL}/contact-us`,  
  } , 

  Home: {
    Destinations: `${BASE_URL}/home-pop-dests`,  
    Locations: `${BASE_URL}/properties/search`,
    Categories: `${BASE_URL}/home-cat-dests/categorized`, 
    Testimonials : `${BASE_URL}/testimonials?isApproved=true` , 
  }, 
  
  HOLIDAY_PACKAGE: {
    holiday_packages: (queryParams: string) => `${BASE_URL}/holiday-package?${queryParams}`, 
    holiday_packages_data_fetch: `${BASE_URL}/holiday-package?page=1&limit=50`,
    holiday_package_orders: `${BASE_URL}/holiday-package-orders?limit=1`,
    Itenary_Fetch: (id: string) => `${BASE_URL}/itineraries?holidayPackageId=${id}` , 
    Gallery_Fetch: (id: string) => `${BASE_URL}/holiday-package-image-categories/package/${id}` , 
    Price_Fetch : (id : string) => `${BASE_URL}/holiday-package-prices/package/${id}` 
  } , 
  
  EVENTS: {
    Enquiry_Page: `${BASE_URL}/event-enquiry`,
    Event_Type: `${BASE_URL}/event-type`, 
    Filter: `${BASE_URL}/event-venue/filters/options`,
    VenueforEventTypes: (id: string) => `${BASE_URL}/event-type/${id}`,
    VenueDetails : (id: string) => `${BASE_URL}/event-venue/${id}`,
  }


} as const;