import coin from '~/api/coin';
import explorer from '~/api/explorer';

/**
 * @typedef {Object} PriceStatus
 * @property {number} block_id
 * @property {number} price
 * @property {string} total_stake
 */

/**
 *
 * @return {Promise<PriceStatus>}
 */
export function getPriceStatus() {
    return coin.get('price')
        .then((response) => response.data.data);
}

/**
 * @typedef {Object} PriceChartItem
 * @property {number} block_id
 * @property {number} price
 */

/**
 *
 * @return {Promise<{data: number[], labels: number[]}>}
 */
export function getPriceChart() {
    return coin.get('price/chart')
        .then((response) => {
            /** @type Array<PriceChartItem> */
            let chartData = response.data.data;
            if (!Array.isArray(chartData)) {
                throw new Error('Not valid response from api');
                //chartData = [];
            }

            // format data for line chart.js
            return chartData.reduce((accum, item) => {
                accum.data.push(item.price);
                accum.labels.push(item.block_id);
                return accum;
            }, {data: [], labels: []});
        });
}




/**
 * @typedef {Object} BlockListInfo
 * @property {Array<Block>} data
 * @property {Object} meta - pagination
 */

/**
 * @param {Object} [params]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @return {Promise<BlockListInfo>}
 */
export function getBlockList(params) {
    return explorer.get('blocks', {
        params,
    })
        .then((response) => response.data);
}


/**
 * @typedef {Object} Block
 * @property {number} height
 * @property {string} timestamp
 * @property {number} txCount - tx count in the block
 * @property {number} size
 * @property {string} hash
 * @property {number} reward
 * @property {number} blockTime
 * @property {string} timestamp
 * @property {Array<ValidatorListItem>} validators
 */


/**
 * @typedef {Object} ValidatorListItem
 * @property {string} publicKey
 * @property {boolean} signed
 */
