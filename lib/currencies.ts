export const Currencies = [
    {
        value: "USD",
        label: "$",
        locale : "en-US",
       
    },
    {
        value: "EUR",
        label: "€",
        locale : "de-DE",
      
    },
    {
        value: "GBP",
        label: "£",
        locale : "en-GB",
      
    },
    {
        value: "JPY",
        label: "¥",
        locale : "ja-JP",
    },
    {
        value: "TND",
        label: "د.ت",
        locale : "ar-TN",
    }
   
];

export type Currency = (typeof Currencies)[0];