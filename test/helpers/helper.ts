const toJSON = (x: any) => (x && x.toJSON && x.toJSON()) || undefined

export { toJSON }
