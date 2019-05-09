export const MAINNET = 'mainnet';
export const TESTNET = 'testnet';
export const NETWORK = process.env.APP_ENV === 'production' ? MAINNET : TESTNET;

export const BASE_TITLE = 'BIP Price';
export const BASE_DESCRIPTION = 'Discover the price of BIP in real time as Minter network participants vote.';
export const COIN_API_URL = process.env.APP_COIN_API_URL + '/';
export const COIN_NAME = NETWORK === MAINNET ? 'BIP' : 'MNT';
export const NETWORK_EXPLORER_CHANNEL = NETWORK === MAINNET ? 'mainnet' : '';
export const EXPLORER_WEB_HOST = NETWORK === MAINNET ? 'https://explorer.minter.network' : 'https://testnet.explorer.minter.network';
export const EXPLORER_API_URL = process.env.APP_EXPLORER_API_URL;
export const EXPLORER_RTM_URL = process.env.APP_EXPLORER_RTM_URL;
export const LANGUAGE_COOKIE_KEY = 'minter-language';
export const I18N_ROUTE_NAME_SEPARATOR = '___';
