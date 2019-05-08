<script>
    export default {
        props: ['error'],
        computed: {
        },
    };
</script>

<template>
    <!-- error layout -->
    <main class="main-content--center u-container u-container--medium">
        <div class="u-text-center">
<!--            <h1 class="u-h1 error__title">-->
<!--                <span v-if="error.statusText">{{ error.statusText }}</span>-->
<!--                <span v-else>Error {{ error.statusCode }}</span>-->
<!--            </h1>-->
<!--            <p class="splash__text">-->
<!--                <span v-if="error.statusCode === 404">Page not found</span>-->
<!--                <span v-else-if="error.statusCode === 0">Network error</span>-->
<!--                <span v-else-if="error.message">{{ error.message }}</span>-->
<!--                <span v-else>Something went wrong</span>-->
<!--            </p>-->
<!--            <a href="http://tg://resolve?domain=MinterPSbot" class="button button&#45;&#45;main" target="_blank" rel="noopener">-->
<!--                <img class="button__icon" src="/img/icon-telegram-white.svg" alt="" role="presentation">-->
<!--                Contact Support-->
<!--            </a>-->

            <h1 class="u-h1 error__title">{{ $td('Error', 'error.title-error') }} {{ error.statusCode }}</h1>
            <p class="" v-if="error.statusCode === 404">{{ $td('Page not found', 'error.message-404') }}</p>
            <p class="" v-else-if="error.statusCode === 504" v-html="$td('Request failed with status code 504. <br> Gateway time-out.', 'error.message-504')"></p>
            <p class="" v-else-if="error.statusCode === 503" v-html="$td('The webpage is currently unavailable. <br> It may be overloaded or down for maintenance.', 'error.message-503')"></p>
            <p class="" v-else-if="error.message === 'Network Error'">{{ $td('Network Error', 'error.message-network') }}</p>
            <p class="" v-else>{{ error.message }}</p>
            <p>
                <span class="button-group button-group--center">
                    <a class="button button--ghost-white" href="" v-if="error.statusCode !== 404">{{ $td('Refresh page', 'error.refresh-link') }}</a>
                    <a class="button button--ghost-white" href="/">{{ $td('Return to main page', 'error.return-link') }}</a>
                </span>
            </p>
        </div>
    </main>
</template>
