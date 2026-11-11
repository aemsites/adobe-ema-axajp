# Dynamic features — detected (2026-11-09T07:31:36.788Z)

Pages probed: /, /prospect/, /product/, /about-insurance/, /company/, /customer/, /customer-feedback/, /recruitment/, /about-axa/, /dataprivacy/ · settle 5000 ms · width 1440 · reach from 10/10 crawled pages

Evidence only. Every row must receive a disposition in `stardust/dynamic-features.md` (`dynamics-plan.mjs` drafts it).

| id | class | feature | pages | reach | evidence | hint |
|---|---|---|---|---|---|---|
| a-unknown-third-party-host-www-google-com | A API / personalisation / settings | unknown third-party host www.google.com | 10/10 |  | www.google.com | inspect |
| a-unknown-third-party-host-bs-nakanohito-jp | A API / personalisation / settings | unknown third-party host bs.nakanohito.jp | 10/10 |  | bs.nakanohito.jp | inspect |
| a-unknown-third-party-host-w2-c9dea2a81a9e4d3c963d5887958afe | A API / personalisation / settings | unknown third-party host w2-c9dea2a81a9e4d3c963d5887958afeb5.ecs.eu-west-1.on.aws | 10/10 |  | w2-c9dea2a81a9e4d3c963d5887958afeb5.ecs.eu-west-1.on.aws | inspect |
| a-first-party-api-get-cookie-extend | A API / personalisation / settings | first-party API GET /cookie/extend | 10/10 | 10/10 | GET /cookie/extend?c1,c2 → 200 | api |
| a-cms-app-settings-object-datalayer | A API / personalisation / settings | CMS / app settings object dataLayer | 10/10 |  |  | settings |
| a-unknown-third-party-host-api-cdn-mypurecloud-jp | A API / personalisation / settings | unknown third-party host api-cdn.mypurecloud.jp | 5/10 |  | api-cdn.mypurecloud.jp | inspect |
| a-unknown-third-party-host-apps-mypurecloud-jp | A API / personalisation / settings | unknown third-party host apps.mypurecloud.jp | 1/10 |  | apps.mypurecloud.jp | inspect |
| cr-main-empty-at-load-filled-after-client-rendered-page | CR client-rendered | main empty at load, filled after (client-rendered page) | 2/10 |  | text at load 109 → settled 1869<br>text at load 0 → settled 1122 | client-rendered-page |
| f-form-prospectform-formwrapper-sc-eb0ec054-0-origin-prospec | F form | form "ProspectForm__FormWrapper-sc-eb0ec054-0" → origin /prospect/be-recommended/results (11 fields) | 2/10 |  | radio:gender,radio:gender,radio:maritalStatus,radio:maritalStatus,radio:children,radio:children,radio:age,radio:age,radio:age,radio:age,radio:age | forms |
| f-form-select-select-no-action-js-wired-4-fields | F form | form "select:+select:" → no action (JS-wired) (4 fields) | 1/10 |  | select:,select:,select:,select: | forms |
| i18n-locale-variants-cr-ir-ir-ir-ir | I18N locale | locale variants cr,ir,ir,ir,ir | 9/10 |  | https://www.axa.co.jp/cr/employee?utm_source=global-navigation&utm_medium=referral&utm_campaign=in_LifeHP<br>https://www.axa.co.jp/ir/?utm_source=global-navigation&utm_medium=referral&utm_campaign=in_LifeHP | locale |
| i18n-locale-variants-zw | I18N locale | locale variants zw | 1/10 |  | https://axol.jp/zw/s/axa_28/entry/ | locale |
| l-listing-candidate-slick-track-9-cards | L listing | listing candidate slick-track (9 cards) | 2/10 |  |  | listings |
| l-listing-candidate-itemslist-styles-listwrapper-sc-809b56aa | L listing | listing candidate ItemsList-styles__ListWrapper-sc-809b56aa-0 hHLxbb (4 cards) | 1/10 |  |  | listings |
| l-listing-candidate-productcategorygroup-styles-productcateg | L listing | listing candidate ProductCategoryGroup-styles__ProductCategoryGroupWrapper-sc-989e0571-0 hBGndD (7 cards) | 1/10 |  |  | listings |
| l-listing-candidate-layout-sc-f22cece7-3-hazlyz-5-cards | L listing | listing candidate Layout-sc-f22cece7-3 haZlyz (5 cards) | 1/10 |  |  | listings |
| l-listing-candidate-customerinfo-styles-contractornoticeswra | L listing | listing candidate CustomerInfo-styles__ContractorNoticesWrapper-sc-df45de50-5 jCMnRi (4 cards) | 1/10 |  |  | listings |
| m-modal-trigger-aria-haspopup-chrome-only-button-content | M modal / interactive | modal trigger aria-haspopup (chrome only) → button:content | 10/10 | 9/10 | 設定の変更（拒否する）<br>Filter Icon | chrome-interaction |
| m-modal-trigger-newcustomermodal-styles-callbacktext-sc-94c5 | M modal / interactive | modal trigger NewCustomerModal-styles__CallBackText-sc-94c556d6-3 → target outside DOM at capture | 9/10 | 9/10 | https://www.axa.co.jp/request/callback | modal |
| s-site-search-form-search-result | S search | site search form → /search-result/ | 9/10 | 0/10 | text:q | search |
| t-tag-manager-google-tag-manager | T tag / consent | tag manager: Google Tag Manager | 10/10 |  | www.googletagmanager.com | tags |
| t-consent-onetrust | T tag / consent | consent: OneTrust | 10/10 |  | cdn-au.onetrust.com<br>privacyportal-au.onetrust.com | tags |
| t-marketing-ad-retargeting-pixel | T tag / consent | marketing: ad / retargeting pixel | 10/10 |  | ad.doubleclick.net<br>js.adsrvr.org<br>bat.bing.com | tags |
| t-unknown-third-party-host-d-line-scdn-net | T tag / consent | unknown third-party host d.line-scdn.net | 10/10 |  | d.line-scdn.net | inspect |
| t-analytics-google-analytics-ads | T tag / consent | analytics: Google Analytics / Ads | 10/10 |  | analytics.google.com<br>www.google-analytics.com | tags |
| t-unknown-third-party-host-s-yimg-jp | T tag / consent | unknown third-party host s.yimg.jp | 10/10 |  | s.yimg.jp | inspect |
| t-unknown-third-party-host-tag-flvcdn-net | T tag / consent | unknown third-party host tag.flvcdn.net | 10/10 |  | tag.flvcdn.net | inspect |
| t-unknown-third-party-host-www-facebook-com | T tag / consent | unknown third-party host www.facebook.com | 10/10 |  | www.facebook.com | inspect |
| t-unknown-third-party-host-cs-nakanohito-jp | T tag / consent | unknown third-party host cs.nakanohito.jp | 10/10 |  | cs.nakanohito.jp | inspect |
| t-unknown-third-party-host-tr-line-me | T tag / consent | unknown third-party host tr.line.me | 10/10 |  | tr.line.me | inspect |
| t-unknown-third-party-host-images-prismic-io | T tag / consent | unknown third-party host images.prismic.io | 8/10 |  | images.prismic.io | inspect |
| t-unknown-third-party-host-prod-japan-cdn-prismic-io | T tag / consent | unknown third-party host prod-japan.cdn.prismic.io | 7/10 |  | prod-japan.cdn.prismic.io | inspect |
| t-analytics-session-replay | T tag / consent | analytics: session replay | 6/10 |  | www.clarity.ms<br>scripts.clarity.ms<br>j.clarity.ms | tags |
| t-unknown-third-party-host-c-bing-com | T tag / consent | unknown third-party host c.bing.com | 6/10 |  | c.bing.com | inspect |
| t-unknown-third-party-host-simage2-pubmatic-com | T tag / consent | unknown third-party host simage2.pubmatic.com | 6/10 |  | simage2.pubmatic.com | inspect |
| t-rum-new-relic | T tag / consent | RUM: New Relic | 5/10 |  | js-agent.newrelic.com<br>bam.nr-data.net | tags |
| t-unknown-third-party-host-x-bidswitch-net | T tag / consent | unknown third-party host x.bidswitch.net | 5/10 |  | x.bidswitch.net | inspect |
| t-chat-live-chat-widget | T tag / consent | chat: live chat widget | 4/10 |  | apps.mypurecloud.jp | tags |
| t-unknown-third-party-host-dsum-sec-casalemedia-com | T tag / consent | unknown third-party host dsum-sec.casalemedia.com | 3/10 |  | dsum-sec.casalemedia.com | inspect |
| v-video-youtube | V media | video: YouTube | 10/10 |  | www.youtube.com | media |
| v-iframe-without-src-runtime-injected-embed | V media | iframe without src (runtime-injected embed) | 10/10 |  | onetrust-text-resize | embed-runtime |
| x-sign-in-account-links | X auth / commerce | sign-in / account links | 9/10 |  | https://www.axa.co.jp/customer/variable/special-account?utm_source=global-navigation&utm_medium=referral&utm_campaign=in_LifeHP<br>https://myweb.axa.co.jp/login | decided-out |
