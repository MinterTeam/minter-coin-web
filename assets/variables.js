export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';
export const NETWORK = process.env.APP_ENV === 'production' ? MAINNET : TESTNET;

export const BASE_TITLE = 'BIP Price';
export const BASE_DESCRIPTION = 'Discover the price of BIP in real time as Minter network participants vote.';
export const COIN_API_URL = process.env.APP_COIN_API_URL + '/';
export const COIN_NAME = NETWORK === MAINNET ? 'BIP' : 'MNT';
export const EXPLORER_URL = NETWORK === MAINNET ? 'https://explorer.minter.network' : 'https://testnet.explorer.minter.network';
export const LANGUAGE_COOKIE_KEY = 'minter-language';
export const I18N_ROUTE_NAME_SEPARATOR = '___';
