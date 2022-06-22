export interface Province {
  CountryID: number
  ProvinceEName: string
  ProvinceID: number
  ProvinceName: string
}

export interface City {
  CityEName: string
  CityID: number
  CityName: string
  CountryName: string
  ProvinceEName: string
  ProvinceID: number
  ProvinceName: string
  UpCityEName: string
  UpCityID: number
  UpCityName: string
}

export interface Message {
  InternalMailID: number
  // InternalMailType: number
  // MemberAccount: string
  Content: string
  CreateDate: string
  IsRead: 0 | 1,
  Title: string
}