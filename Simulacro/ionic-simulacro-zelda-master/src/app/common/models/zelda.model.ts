export interface ApiResponseZelda {
  data: ZeldaMaterial[]
  message: string
  status: number
}

export interface ZeldaMaterial {
  category: string
  common_locations: string[]
  cooking_effect: string
  description: string
  dlc: boolean
  hearts_recovered: number
  id: number
  image: string
  name: string
}
