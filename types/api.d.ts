export type User = {
  name: string
  id: string
  created_at: Date
  auth_id?: string
}

export type PaginationOpts = {
  page?: number
  perPage?: number
}
