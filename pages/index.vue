<script>
    import * as clipboard from 'clipbrd';
    import Centrifuge from 'centrifuge';
    import {getPriceStatus, getPriceChart, getBlockList} from "~/api/index";
    import getTitle from '~/assets/get-title';
    import checkEmpty from '~/assets/v-check-empty';
    import {pretty, prettyRound, prettyUsd, getExplorerAddressUrl, pluralFormRu, pluralFormEn} from "~/assets/utils";
    import {EXPLORER_RTM_URL, NETWORK, NETWORK_EXPLORER_CHANNEL} from "~/assets/variables";
    import Language from '~/layouts/_language';
    import CoinHistoryChart from '~/components/CoinHistoryChart';

    const VOTE_ADDRESS = 'Mx00000000000000000000000000000000000000a1';
    const NETWORK_WS_PREFIX = NETWORK_EXPLORER_CHANNEL ? NETWORK_EXPLORER_CHANNEL + '_' : '';

    let centrifuge;

    export default {
        ideFix: 0,
        VOTE_ADDRESS,
        components: {
            Language,
            CoinHistoryChart,
        },
        directives: {
            checkEmpty,
        },
        filters: {
            pretty,
            prettyUsd,
            prettyRound,
            uppercase: (value) => value.toString().toUpperCase(),
        },
        asyncData({ error }) {
            return Promise.all([getPriceStatus(), getPriceChart(), getBlockList()])
                .then(([priceStatus, priceChart, blockList]) => {
                    return {
                        voteFinishBlockHeight: priceStatus.block_id,
                        currentPrice: priceStatus.price,
                        totalVotingStake: priceStatus.total_stake,
                        priceChart,
                        latestBlockHeight: blockList.data[0].height,
                    };
                })
                .catch((resError) => {
                    console.log(resError, resError.response);
                    if (resError.response && resError.response.status) {
                        error({
                            statusCode: resError.response.status,
                            message: resError.response.statusText,
                        });
                    } else {
                        error({ statusCode: resError.request && resError.request.status, message: resError.message });
                    }
                });
        },
        head() {
            const title = getTitle(this.$td('BIP Price', 'index.seo-title'));
            const description = this.$td('Discover the price of BIP in real time as Minter network participants vote.', 'index.seo-description');
            const localeSuffix = this.$i18n.locale === 'en' ? '' : '-' + this.$i18n.locale;

            return {
                title: title,
                meta: [
                    { hid: 'og-title', name: 'og:title', content: title },
                    { hid: 'description', name: 'description', content: description },
                    { hid: 'og-description', name: 'og:description', content: description },
                    { hid: 'og-image', name: 'og:image', content: `/social-share${localeSuffix}.png` },
                ],
            };
        },
        data() {
            return {
                voteFinishBlockHeight: 0,
                latestBlockHeight: 0,
                currentPrice: 0,
                totalVotingStake: 0,
                priceChart: {data: [1, 2, 2.5, 3, 3, 4], labels: [1, 2, 2.5, 3, 3, 4]},
            };
        },
        computed: {
            voteFinish() {
                const DAY_MS = 1000*60*60*24;
                const HOUR_MS = 1000*60*60;
                const MINUTE_MS = 1000*60;

                let blocks = this.voteFinishBlockHeight - this.latestBlockHeight;
                blocks = Math.max(blocks, 0);

                // diff in milliseconds
                let diff = blocks * 5 * 1000;
                diff = Math.max(diff, 0);

                // const days = Math.floor(diff/DAY_MS);
                // diff -= days * DAY_MS;
                const hours = Math.floor(diff/HOUR_MS);
                diff -= hours * HOUR_MS;
                const minutes = Math.floor(diff/MINUTE_MS);

                return {
                    blocks,
                    // days,
                    hours,
                    minutes,
                };
            },
            pluralBlocks() {
                if (this.$i18n.locale === 'ru') {
                    return pluralFormRu(this.voteFinish.blocks, 'блок', 'блока', 'блоков');
                } else {
                    return pluralFormEn(this.voteFinish.blocks, 'block', 'blocks');
                }
            },
            guideUrl() {
                if (this.$i18n.locale === 'ru') {
                    return 'https://medium.com/@MinterTeam/%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-minter-mainnet-%D0%B8-%D0%B3%D0%BE%D0%BB%D0%BE%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D0%BE-%D1%86%D0%B5%D0%BD%D0%B5-bip-108d2b22c434';
                } else {
                    return 'https://medium.com/@MinterTeam/minter-mainnet-launch-and-voting-for-the-price-of-bip-3ef9290476c5';
                }
            },
            isClipboardSupported() {
                return clipboard.isSupported();
            },
        },
        beforeMount() {
            this.subscribeWS();
        },
        destroyed() {
            if (centrifuge) {
                centrifuge.disconnect();
            }
        },
        methods: {
            subscribeWS(connectData) {
                centrifuge = new Centrifuge(EXPLORER_RTM_URL, {
                    // user: connectData.user ? connectData.user : '',
                    // timestamp: connectData.timestamp.toString(),
                    // token: connectData.token,
                    // sockjs: SockJS,
                });

                centrifuge.subscribe(NETWORK_WS_PREFIX + "blocks", (response) => {
                    const newBlock = response.data;
                    this.latestBlockHeight = newBlock.height;
                });

                centrifuge.connect();
            },
            copy(str) {
                const isCopied = clipboard.copy(str);
                if (isCopied) {
                    // show snackbar
                    this.$store.commit('SET_SNACKBAR_ACTIVE');
                }
            },
            getExplorerAddressUrl,
        },
    };
</script>

<template>
    <!-- layout dashboard -->
    <div class="main-content--with-header">
        <header class="header">
            <div class="header__container u-container u-container--medium">
                <nuxt-link class="header__logo no-link" to="/">
                    <img class="header__logo-image" src="/img/minter-logo-circle.svg" alt="Minter" width="36" height="36">
                    <div class="header__logo-text">Coin</div>
                </nuxt-link>

                <Language/>
            </div>
        </header>


        <main class="main-inner main-inner--snapshot u-container u-container--medium">

            <!-- sale stats -->
            <div class="u-grid u-grid--vertical-margin">
                <div class="u-cell u-cell--large--auto" v-if="voteFinish.blocks !== 0">
                    <div class="dashboard__item-title dashboard__title">
                        {{ $td('The voting ends in', 'index.finish-title') }}
                    </div>
                    <div class="dashboard__accent-sub">{{ voteFinish.hours }}{{ $td('h', 'index.finish-hours') }} {{
                        voteFinish.minutes }}{{ $td('m', 'index.finish-minutes') }}</div>
                    <div class="dashboard__item-element">{{ voteFinish.blocks | prettyRound }} {{ this.pluralBlocks }}</div>
                </div>
                <div class="u-cell u-cell--large--auto" v-else>
                    <div class="dashboard__item-title dashboard__title">
                        {{ $td('The voting ended at', 'index.voting-ended-title') }}
                    </div>
                    <div class="dashboard__accent-sub">{{ voteFinishBlockHeight | prettyRound }} {{ $td('block',
                        'index.voting-ended-block') }}</div>
                    <div class="dashboard__item-element"></div>
                </div>
                <div class="u-cell u-cell--large--auto">
                    <div class="dashboard__item-title dashboard__title">
                        {{ $td('Current price of BIP', 'index.current-price-title') }}
                    </div>
                    <div class="dashboard__accent-sub dashboard__accent-sub--green">${{ currentPrice | prettyUsd }}</div>

                    <div class="dashboard__item-title dashboard__title">
                        {{ $td('Total stake of votes', 'index.total-stake-title') }}
                    </div>
                    <div class="dashboard__accent-sub">{{ totalVotingStake | prettyRound }} {{ $store.getters.COIN_NAME }}</div>

                    <div class="dashboard__item">
                        <a class="link--default" :href="getExplorerAddressUrl($options.VOTE_ADDRESS)" target="_blank">{{ $td('See transactions', 'index.total-stake-link') }}</a>
                    </div>
                </div>

                <div class="u-cell u-cell--large--auto history-cell">
                    <div class="dashboard__item-title dashboard__title">
                        {{ $td('BIP Price Chart', 'index.price-chart-title') }}
                    </div>
                    <CoinHistoryChart :dataset="priceChart" />
                </div>
            </div>


            <div class="dashboard__well">
                <h2 class="dashboard__title dashboard__title--margin dashboard__title--white">{{ $td('How to vote?', 'index.guide-title') }}</h2>
                <p>{{ $td('1. To vote for the price of BIP, send a transaction with any sum to the address:', 'index.guide-description-1') }}</p>
                <p class="index__guide-field form-field form-field--invert form-field--simulate form-field--without-label form-field--with-icon">
                    <span class="index__guide-input form-field__input is-not-empty">{{ $options.VOTE_ADDRESS }}</span>
                    <button class="form-field__icon u-semantic-button link--opacity"
                            @click="copy($options.VOTE_ADDRESS)"
                            v-if="isClipboardSupported"
                    >
                        <img src="/img/icon-copy.svg" alt="Copy">
                    </button>
                </p>
                <p>{{ $td('2. In a transaction message (Payload), specify the USD price that you vote for, ranging from 0.001 to 1000—for example, 0.5.', 'index.guide-description-2') }}</p>
                <p>
                    <a class="link--default" href=""></a>
                    <a class="link--default u-display-ib" :href="guideUrl" target="_blank">{{ $td('Read more about the voting system.', 'index.guide-link') }}</a>
                </p>
            </div>

        </main>
    </div>
</template>
