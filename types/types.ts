export interface IMarketdata {
    rate_usd: number,
    ath: number,
    atl: number,
    change_24h: number,
    low_24h: number,
    high_24h: number,
    change_percentage_24h: number,
    change_percentage_7d: number,
    init_supply: number,
    max_supply: number,
    total_supply: number,
    current_supply: number,
    daily_volume_usd: number,
    market_cap_usd: number,
    fully_diluted_valuation_usd: number,

}

export interface ITokens {
    name: string,
    symbol: string,
    address: string,
    icon: string,
    decimals: number,
    description: string,
    website: string,
    telegram: string,
    twitter: string,
    discord: string,
    market_data: IMarketdata
}
