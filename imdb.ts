import { InlineQueryResult, InlineQueryResultButton } from "mtkruto/mod.ts";
import { urlFetchEr } from "./page.ts";
import { PackTitleInvalid } from "mtkruto/3_errors.ts";

export interface SearchResult {
    "#TITLE": string;
    "#YEAR": number;
    "#IMDB_ID": string;
    "#RANK": number;
    "#ACTORS": string;
    "#AKA": string;
    "#IMDB_URL": string;
    "#IMDB_IV": string;
    "#IMG_POSTER"?: string;
    photo_width?: number;
    photo_height?: number;
}

export interface SearchAPI {
    ok: boolean;
    description: SearchResult[];
    error_code: number;
}

export interface SearchResponse {
    results: InlineQueryResult[];
    nextOffset: string | undefined;
    button: InlineQueryResultButton;
}

export async function SearchIMDb(
    q: string,
    o: number,
    l: number,
): Promise<SearchResponse> {
    const srchApiUrl = Deno.env.get("IMDB_API_URL");
    if (srchApiUrl === undefined) {
        return {
            results: [],
            nextOffset: undefined,
            button: {
                text: "IMDB_API_URL not set!",
                startParameter: "error1",
            },
        };
    }
    const noImgUrl = Deno.env.get("IMDB_DEFAULT_NO_IMG_URL");
    const rq = await urlFetchEr(
        srchApiUrl + "/?" + "q=" + encodeURIComponent(q) + "",
        {},
    );
    const ssr: SearchAPI = JSON.parse(rq.trim());
    let r = [];
    let c = 0;
    for (const result of ssr.description) {
        if ((result["#IMG_POSTER"] || "").trim() !== "") {
            r.push({
                type: "photo",
                id: `f ${c} ${o} ${result["#IMDB_ID"]}`,
                photoUrl: result["#IMG_POSTER"],
                thumbnailUrl: noImgUrl || result["#IMG_POSTER"],
                photoWidth: result.photo_width,
                photoHeight: result.photo_height,
                title: `${result["#TITLE"]} ${result["#YEAR"]}`,
                description: `${result["#AKA"]} | ${result["#RANK"]} | ${
                    result["#ACTORS"]
                }`,
                // caption: `<a href='${result["#IMDB_URL"]}'>${result["#TITLE"]} ${result["#YEAR"]}</a>`,
                // parse_mode: "HTML",
                replyMarkup: {
                    inlineKeyboard: [
                        [
                            {
                                text: `${result["#TITLE"]} ${result["#YEAR"]}`,
                                url: result["#IMDB_IV"],
                            },
                        ],
                    ],
                },
            });
        }
        c = c + 1;
    }
    return {
        results: r,
        nextOffset: undefined,
        button: {
            text: `Found ${r.length} / ${c} Results for '${q}'`,
            startParameter: "noerror2",
        },
    };
}

export interface IMDbDetail {
    short: Short;
    imdbId: string;
    top: Top;
    main: Main;
    fake: Fake;
    storyLine: StoryLine;
}

export interface Short {
    "@context": string;
    "@type": string;
    url: string;
    name: string;
    image: string;
    description: string;
    review: Review;
    aggregateRating: AggregateRating;
    contentRating: string;
    genre: string[];
    datePublished: string;
    keywords: string;
    actor: Actor[];
    director: Director[];
    creator: Creator[];
    duration: string;
}

export interface Review {
    "@type": string;
    itemReviewed: ItemReviewed;
    author: Author;
    dateCreated: string;
    inLanguage: string;
    name: string;
    reviewBody: string;
    reviewRating: ReviewRating;
}

export interface ItemReviewed {
    "@type": string;
    url: string;
}

export interface Author {
    "@type": string;
    name: string;
}

export interface ReviewRating {
    "@type": string;
    worstRating: number;
    bestRating: number;
    ratingValue: number;
}

export interface AggregateRating {
    "@type": string;
    ratingCount: number;
    bestRating: number;
    worstRating: number;
    ratingValue: number;
}

export interface Actor {
    "@type": string;
    url: string;
    name: string;
}

export interface Director {
    "@type": string;
    url: string;
    name: string;
}

export interface Creator {
    "@type": string;
    url: string;
    name: string;
}

export interface Top {
    id: string;
    productionStatus: ProductionStatus;
    canHaveEpisodes: boolean;
    series: any;
    titleText: TitleText;
    titleType: TitleType;
    originalTitleText: OriginalTitleText;
    certificate: Certificate;
    releaseYear: ReleaseYear;
    releaseDate: ReleaseDate;
    runtime: Runtime;
    canRate: CanRate;
    ratingsSummary: RatingsSummary;
    meterRanking: any;
    primaryImage: PrimaryImage;
    images: Images;
    videos: Videos;
    primaryVideos: PrimaryVideos;
    externalLinks: ExternalLinks;
    metacritic: any;
    keywords: Keywords;
    genres: Genres;
    plot: Plot;
    plotContributionLink: PlotContributionLink;
    credits: Credits;
    principalCredits: PrincipalCredit[];
    reviews: Reviews;
    criticReviewsTotal: CriticReviewsTotal;
    triviaTotal: TriviaTotal;
    engagementStatistics: any;
    subNavCredits: SubNavCredits;
    subNavReviews: SubNavReviews;
    subNavTrivia: SubNavTrivia;
    subNavFaqs: SubNavFaqs;
    subNavTopQuestions: SubNavTopQuestions;
    titleGenres: TitleGenres;
    meta: Meta;
    castPageTitle: CastPageTitle;
    creatorsPageTitle: any[];
    directorsPageTitle: DirectorsPageTitle[];
    countriesOfOrigin: CountriesOfOrigin;
    production: Production;
    featuredReviews: FeaturedReviews;
    __typename: string;
}

export interface ProductionStatus {
    currentProductionStage: CurrentProductionStage;
    productionStatusHistory: ProductionStatusHistory[];
    restriction: any;
    __typename: string;
}

export interface CurrentProductionStage {
    id: string;
    text: string;
    __typename: string;
}

export interface ProductionStatusHistory {
    status: Status;
    __typename: string;
}

export interface Status {
    id: string;
    text: string;
    __typename: string;
}

export interface TitleText {
    text: string;
    __typename: string;
}

export interface TitleType {
    displayableProperty: DisplayableProperty;
    text: string;
    id: string;
    isSeries: boolean;
    isEpisode: boolean;
    categories: Category[];
    canHaveEpisodes: boolean;
    __typename: string;
}

export interface DisplayableProperty {
    value: Value;
    __typename: string;
}

export interface Value {
    plainText: string;
    __typename: string;
}

export interface Category {
    value: string;
    __typename: string;
}

export interface OriginalTitleText {
    text: string;
    __typename: string;
}

export interface Certificate {
    rating: string;
    __typename: string;
}

export interface ReleaseYear {
    year: number;
    endYear: any;
    __typename: string;
}

export interface ReleaseDate {
    day: number;
    month: number;
    year: number;
    __typename: string;
}

export interface Runtime {
    seconds: number;
    displayableProperty: DisplayableProperty2;
    __typename: string;
}

export interface DisplayableProperty2 {
    value: Value2;
    __typename: string;
}

export interface Value2 {
    plainText: string;
    __typename: string;
}

export interface CanRate {
    isRatable: boolean;
    __typename: string;
}

export interface RatingsSummary {
    aggregateRating: number;
    voteCount: number;
    __typename: string;
}

export interface PrimaryImage {
    id: string;
    width: number;
    height: number;
    url: string;
    caption: Caption;
    __typename: string;
}

export interface Caption {
    plainText: string;
    __typename: string;
}

export interface Images {
    total: number;
    edges: Edge[];
    __typename: string;
}

export interface Edge {
    node: Node;
    __typename: string;
}

export interface Node {
    id: string;
    __typename: string;
}

export interface Videos {
    total: number;
    __typename: string;
}

export interface PrimaryVideos {
    edges: any[];
    __typename: string;
}

export interface ExternalLinks {
    total: number;
    __typename: string;
}

export interface Keywords {
    total: number;
    edges: Edge2[];
    __typename: string;
}

export interface Edge2 {
    node: Node2;
    __typename: string;
}

export interface Node2 {
    text: string;
    __typename: string;
}

export interface Genres {
    genres: Genre[];
    __typename: string;
}

export interface Genre {
    text: string;
    id: string;
    __typename: string;
}

export interface Plot {
    plotText: PlotText;
    language: Language;
    __typename: string;
}

export interface PlotText {
    plainText: string;
    __typename: string;
}

export interface Language {
    id: string;
    __typename: string;
}

export interface PlotContributionLink {
    url: string;
    __typename: string;
}

export interface Credits {
    total: number;
    __typename: string;
}

export interface PrincipalCredit {
    totalCredits: number;
    category: Category2;
    credits: Credit[];
    __typename: string;
}

export interface Category2 {
    text: string;
    id: string;
    __typename: string;
}

export interface Credit {
    name: Name;
    attributes: any;
    __typename: string;
}

export interface Name {
    nameText: NameText;
    id: string;
    __typename: string;
}

export interface NameText {
    text: string;
    __typename: string;
}

export interface Reviews {
    total: number;
    __typename: string;
}

export interface CriticReviewsTotal {
    total: number;
    __typename: string;
}

export interface TriviaTotal {
    total: number;
    __typename: string;
}

export interface SubNavCredits {
    total: number;
    __typename: string;
}

export interface SubNavReviews {
    total: number;
    __typename: string;
}

export interface SubNavTrivia {
    total: number;
    __typename: string;
}

export interface SubNavFaqs {
    total: number;
    __typename: string;
}

export interface SubNavTopQuestions {
    total: number;
    __typename: string;
}

export interface TitleGenres {
    genres: Genre2[];
    __typename: string;
}

export interface Genre2 {
    genre: Genre3;
    __typename: string;
}

export interface Genre3 {
    text: string;
    __typename: string;
}

export interface Meta {
    canonicalId: string;
    publicationStatus: string;
    __typename: string;
}

export interface CastPageTitle {
    edges: Edge3[];
    __typename: string;
}

export interface Edge3 {
    node: Node3;
    __typename: string;
}

export interface Node3 {
    name: Name2;
    __typename: string;
}

export interface Name2 {
    nameText: NameText2;
    __typename: string;
}

export interface NameText2 {
    text: string;
    __typename: string;
}

export interface DirectorsPageTitle {
    credits: Credit2[];
    __typename: string;
}

export interface Credit2 {
    name: Name3;
    __typename: string;
}

export interface Name3 {
    nameText: NameText3;
    __typename: string;
}

export interface NameText3 {
    text: string;
    __typename: string;
}

export interface CountriesOfOrigin {
    countries: Country[];
    __typename: string;
}

export interface Country {
    id: string;
    __typename: string;
}

export interface Production {
    edges: any[];
    __typename: string;
}

export interface FeaturedReviews {
    edges: Edge4[];
    __typename: string;
}

export interface Edge4 {
    node: Node4;
    __typename: string;
}

export interface Node4 {
    author: Author2;
    summary: Summary;
    text: Text;
    authorRating: number;
    submissionDate: string;
    __typename: string;
}

export interface Author2 {
    nickName: string;
    __typename: string;
}

export interface Summary {
    originalText: string;
    __typename: string;
}

export interface Text {
    originalText: OriginalText;
    __typename: string;
}

export interface OriginalText {
    plainText: string;
    __typename: string;
}

export interface Main {
    id: string;
    wins: Wins;
    nominations: Nominations;
    prestigiousAwardSummary: any;
    ratingsSummary: RatingsSummary2;
    episodes: any;
    videos: Videos2;
    videoStrip: VideoStrip;
    titleMainImages: TitleMainImages;
    productionStatus: ProductionStatus2;
    primaryImage: PrimaryImage2;
    imageUploadLink: ImageUploadLink;
    titleType: TitleType2;
    cast: Cast;
    creators: any[];
    directors: Director2[];
    writers: Writer[];
    isAdult: boolean;
    moreLikeThisTitles: MoreLikeThisTitles;
    triviaTotal: TriviaTotal2;
    trivia: Trivia;
    goofsTotal: GoofsTotal;
    goofs: Goofs;
    quotesTotal: QuotesTotal;
    quotes: Quotes;
    crazyCredits: CrazyCredits;
    alternateVersions: AlternateVersions;
    connections: Connections;
    soundtrack: Soundtrack;
    titleText: TitleText4;
    originalTitleText: OriginalTitleText4;
    releaseYear: ReleaseYear4;
    reviews: Reviews2;
    featuredReviews: FeaturedReviews2;
    canRate: CanRate3;
    iframeAddReviewLink: IframeAddReviewLink;
    topQuestions: TopQuestions;
    faqs: Faqs;
    releaseDate: ReleaseDate2;
    countriesOfOrigin: CountriesOfOrigin2;
    detailsExternalLinks: DetailsExternalLinks;
    spokenLanguages: SpokenLanguages;
    akas: Akas;
    filmingLocations: FilmingLocations;
    production: Production2;
    companies: Companies;
    productionBudget: any;
    lifetimeGross: any;
    openingWeekendGross: any;
    worldwideGross: any;
    technicalSpecifications: TechnicalSpecifications;
    runtime: Runtime3;
    series: any;
    canHaveEpisodes: boolean;
    contributionQuestions: ContributionQuestions;
    __typename: string;
}

export interface Wins {
    total: number;
    __typename: string;
}

export interface Nominations {
    total: number;
    __typename: string;
}

export interface RatingsSummary2 {
    topRanking: any;
    __typename: string;
}

export interface Videos2 {
    total: number;
    __typename: string;
}

export interface VideoStrip {
    edges: any[];
    __typename: string;
}

export interface TitleMainImages {
    total: number;
    edges: Edge5[];
    __typename: string;
}

export interface Edge5 {
    node: Node5;
    __typename: string;
}

export interface Node5 {
    id: string;
    url: string;
    caption: Caption2;
    height: number;
    width: number;
    __typename: string;
}

export interface Caption2 {
    plainText: string;
    __typename: string;
}

export interface ProductionStatus2 {
    currentProductionStage: CurrentProductionStage2;
    productionStatusHistory: ProductionStatusHistory2[];
    restriction: any;
    __typename: string;
}

export interface CurrentProductionStage2 {
    id: string;
    text: string;
    __typename: string;
}

export interface ProductionStatusHistory2 {
    status: Status2;
    __typename: string;
}

export interface Status2 {
    id: string;
    text: string;
    __typename: string;
}

export interface PrimaryImage2 {
    id: string;
    __typename: string;
}

export interface ImageUploadLink {
    url: string;
    __typename: string;
}

export interface TitleType2 {
    id: string;
    canHaveEpisodes: boolean;
    __typename: string;
}

export interface Cast {
    edges: Edge6[];
    __typename: string;
}

export interface Edge6 {
    node: Node6;
    __typename: string;
}

export interface Node6 {
    name: Name4;
    attributes?: Attribute[];
    category: Category3;
    characters?: Character[];
    episodeCredits: EpisodeCredits;
    __typename: string;
}

export interface Name4 {
    id: string;
    nameText: NameText4;
    primaryImage?: PrimaryImage3;
    __typename: string;
}

export interface NameText4 {
    text: string;
    __typename: string;
}

export interface PrimaryImage3 {
    url: string;
    width: number;
    height: number;
    __typename: string;
}

export interface Attribute {
    text: string;
    __typename: string;
}

export interface Category3 {
    id: string;
    __typename: string;
}

export interface Character {
    name: string;
    __typename: string;
}

export interface EpisodeCredits {
    total: number;
    yearRange: any;
    __typename: string;
}

export interface Director2 {
    totalCredits: number;
    category: Category4;
    credits: Credit3[];
    __typename: string;
}

export interface Category4 {
    text: string;
    __typename: string;
}

export interface Credit3 {
    name: Name5;
    attributes: any;
    __typename: string;
}

export interface Name5 {
    id: string;
    nameText: NameText5;
    __typename: string;
}

export interface NameText5 {
    text: string;
    __typename: string;
}

export interface Writer {
    totalCredits: number;
    category: Category5;
    credits: Credit4[];
    __typename: string;
}

export interface Category5 {
    text: string;
    __typename: string;
}

export interface Credit4 {
    name: Name6;
    attributes: any;
    __typename: string;
}

export interface Name6 {
    id: string;
    nameText: NameText6;
    __typename: string;
}

export interface NameText6 {
    text: string;
    __typename: string;
}

export interface MoreLikeThisTitles {
    edges: Edge7[];
    __typename: string;
}

export interface Edge7 {
    node: Node7;
    __typename: string;
}

export interface Node7 {
    id: string;
    titleText: TitleText2;
    titleType: TitleType3;
    originalTitleText: OriginalTitleText2;
    primaryImage: PrimaryImage4;
    releaseYear: ReleaseYear2;
    ratingsSummary: RatingsSummary3;
    runtime?: Runtime2;
    certificate?: Certificate2;
    canRate: CanRate2;
    titleGenres: TitleGenres2;
    canHaveEpisodes: boolean;
    __typename: string;
}

export interface TitleText2 {
    text: string;
    __typename: string;
}

export interface TitleType3 {
    id: string;
    text: string;
    canHaveEpisodes: boolean;
    displayableProperty: DisplayableProperty3;
    __typename: string;
}

export interface DisplayableProperty3 {
    value: Value3;
    __typename: string;
}

export interface Value3 {
    plainText: string;
    __typename: string;
}

export interface OriginalTitleText2 {
    text: string;
    __typename: string;
}

export interface PrimaryImage4 {
    id: string;
    width: number;
    height: number;
    url: string;
    caption: Caption3;
    __typename: string;
}

export interface Caption3 {
    plainText: string;
    __typename: string;
}

export interface ReleaseYear2 {
    year: number;
    endYear: any;
    __typename: string;
}

export interface RatingsSummary3 {
    aggregateRating: number;
    voteCount: number;
    __typename: string;
}

export interface Runtime2 {
    seconds: number;
    __typename: string;
}

export interface Certificate2 {
    rating: string;
    __typename: string;
}

export interface CanRate2 {
    isRatable: boolean;
    __typename: string;
}

export interface TitleGenres2 {
    genres: Genre4[];
    __typename: string;
}

export interface Genre4 {
    genre: Genre5;
    __typename: string;
}

export interface Genre5 {
    text: string;
    __typename: string;
}

export interface TriviaTotal2 {
    total: number;
    __typename: string;
}

export interface Trivia {
    edges: any[];
    __typename: string;
}

export interface GoofsTotal {
    total: number;
    __typename: string;
}

export interface Goofs {
    edges: any[];
    __typename: string;
}

export interface QuotesTotal {
    total: number;
    __typename: string;
}

export interface Quotes {
    edges: any[];
    __typename: string;
}

export interface CrazyCredits {
    edges: any[];
    __typename: string;
}

export interface AlternateVersions {
    total: number;
    edges: any[];
    __typename: string;
}

export interface Connections {
    edges: Edge8[];
    __typename: string;
}

export interface Edge8 {
    node: Node8;
    __typename: string;
}

export interface Node8 {
    associatedTitle: AssociatedTitle;
    category: Category6;
    __typename: string;
}

export interface AssociatedTitle {
    id: string;
    releaseYear: ReleaseYear3;
    titleText: TitleText3;
    originalTitleText: OriginalTitleText3;
    series: any;
    __typename: string;
}

export interface ReleaseYear3 {
    year: number;
    __typename: string;
}

export interface TitleText3 {
    text: string;
    __typename: string;
}

export interface OriginalTitleText3 {
    text: string;
    __typename: string;
}

export interface Category6 {
    text: string;
    __typename: string;
}

export interface Soundtrack {
    edges: any[];
    __typename: string;
}

export interface TitleText4 {
    text: string;
    __typename: string;
}

export interface OriginalTitleText4 {
    text: string;
    __typename: string;
}

export interface ReleaseYear4 {
    year: number;
    __typename: string;
}

export interface Reviews2 {
    total: number;
    __typename: string;
}

export interface FeaturedReviews2 {
    edges: Edge9[];
    __typename: string;
}

export interface Edge9 {
    node: Node9;
    __typename: string;
}

export interface Node9 {
    id: string;
    author: Author3;
    summary: Summary2;
    text: Text2;
    authorRating: number;
    submissionDate: string;
    helpfulness: Helpfulness;
    __typename: string;
}

export interface Author3 {
    nickName: string;
    userId: string;
    __typename: string;
}

export interface Summary2 {
    originalText: string;
    __typename: string;
}

export interface Text2 {
    originalText: OriginalText2;
    __typename: string;
}

export interface OriginalText2 {
    plaidHtml: string;
    __typename: string;
}

export interface Helpfulness {
    upVotes: number;
    downVotes: number;
    __typename: string;
}

export interface CanRate3 {
    isRatable: boolean;
    __typename: string;
}

export interface IframeAddReviewLink {
    url: string;
    __typename: string;
}

export interface TopQuestions {
    total: number;
    edges: any[];
    __typename: string;
}

export interface Faqs {
    total: number;
    edges: any[];
    __typename: string;
}

export interface ReleaseDate2 {
    day: number;
    month: number;
    year: number;
    country: Country2;
    __typename: string;
}

export interface Country2 {
    id: string;
    text: string;
    __typename: string;
}

export interface CountriesOfOrigin2 {
    countries: Country3[];
    __typename: string;
}

export interface Country3 {
    id: string;
    text: string;
    __typename: string;
}

export interface DetailsExternalLinks {
    edges: Edge10[];
    total: number;
    __typename: string;
}

export interface Edge10 {
    node: Node10;
    __typename: string;
}

export interface Node10 {
    url: string;
    label: string;
    externalLinkRegion: any;
    __typename: string;
}

export interface SpokenLanguages {
    spokenLanguages: SpokenLanguage[];
    __typename: string;
}

export interface SpokenLanguage {
    id: string;
    text: string;
    __typename: string;
}

export interface Akas {
    edges: any[];
    __typename: string;
}

export interface FilmingLocations {
    edges: any[];
    total: number;
    __typename: string;
}

export interface Production2 {
    edges: any[];
    __typename: string;
}

export interface Companies {
    total: number;
    __typename: string;
}

export interface TechnicalSpecifications {
    soundMixes: SoundMixes;
    aspectRatios: AspectRatios;
    colorations: Colorations;
    __typename: string;
}

export interface SoundMixes {
    items: any[];
    __typename: string;
}

export interface AspectRatios {
    items: any[];
    __typename: string;
}

export interface Colorations {
    items: Item[];
    __typename: string;
}

export interface Item {
    conceptId: string;
    text: string;
    attributes: any[];
    __typename: string;
}

export interface Runtime3 {
    seconds: number;
    __typename: string;
}

export interface ContributionQuestions {
    contributionLink: ContributionLink;
    edges: Edge11[];
    __typename: string;
}

export interface ContributionLink {
    url: string;
    __typename: string;
}

export interface Edge11 {
    node: Node11;
    __typename: string;
}

export interface Node11 {
    entity: Entity;
    questionId: string;
    questionText: QuestionText;
    contributionLink: ContributionLink2;
    __typename: string;
}

export interface Entity {
    primaryImage: PrimaryImage5;
    __typename: string;
}

export interface PrimaryImage5 {
    url: string;
    width: number;
    height: number;
    caption: Caption4;
    __typename: string;
}

export interface Caption4 {
    plainText: string;
    __typename: string;
}

export interface QuestionText {
    plainText: string;
    __typename: string;
}

export interface ContributionLink2 {
    url: string;
    __typename: string;
}

export interface Fake {
    "#TITLE": string;
    "#YEAR": number;
    "#IMDB_ID": string;
    "#RANK": number;
    "#ACTORS": string;
    "#AKA": string;
    "#IMDB_URL": string;
    "#IMDB_IV": string;
    "#IMG_POSTER": string;
    photo_width: number;
    photo_height: number;
}

export interface StoryLine {
    id: string;
    summaries: Summaries;
    outlines: Outlines;
    synopses: Synopses;
    storylineKeywords: StorylineKeywords;
    taglines: Taglines;
    genres: Genres2;
    certificate: Certificate3;
    parentsGuide: ParentsGuide;
    __typename: string;
}

export interface Summaries {
    edges: Edge12[];
    __typename: string;
}

export interface Edge12 {
    node: Node12;
    __typename: string;
}

export interface Node12 {
    plotText: PlotText2;
    experimental_translatedPlotText: any;
    author: string;
    __typename: string;
}

export interface PlotText2 {
    plaidHtml: string;
    __typename: string;
}

export interface Outlines {
    edges: Edge13[];
    __typename: string;
}

export interface Edge13 {
    node: Node13;
    __typename: string;
}

export interface Node13 {
    plotText: PlotText3;
    experimental_translatedPlotText: any;
    __typename: string;
}

export interface PlotText3 {
    plaidHtml: string;
    __typename: string;
}

export interface Synopses {
    edges: any[];
    __typename: string;
}

export interface StorylineKeywords {
    edges: Edge14[];
    total: number;
    __typename: string;
}

export interface Edge14 {
    node: Node14;
    __typename: string;
}

export interface Node14 {
    legacyId: string;
    text: string;
    __typename: string;
}

export interface Taglines {
    edges: any[];
    total: number;
    __typename: string;
}

export interface Genres2 {
    genres: Genre6[];
    __typename: string;
}

export interface Genre6 {
    id: string;
    text: string;
    __typename: string;
}

export interface Certificate3 {
    rating: string;
    ratingReason: any;
    ratingsBody: any;
    __typename: string;
}

export interface ParentsGuide {
    guideItems: GuideItems;
    __typename: string;
}

export interface GuideItems {
    total: number;
    __typename: string;
}

export interface DetailIMDb {
    text: string;
}

export async function GetIMDb(
    tt: string,
): Promise<DetailIMDb> {
    const srchApiUrl = Deno.env.get("IMDB_API_URL");
    if (srchApiUrl === undefined) {
        return {
            text: "IMDB_API_URL not set!",
        };
    }
    const noImgUrl = Deno.env.get("IMDB_DEFAULT_NO_IMG_URL");
    const rq = await urlFetchEr(
        srchApiUrl + "/?" + "tt=" + encodeURIComponent(tt) + "",
        {},
    );
    const bndsj: IMDbDetail = JSON.parse(rq.trim());

    const imdbBaseUrl = "https://imdb.com";
    let pct = "";
    const imdbUrl = `${imdbBaseUrl}/title/${bndsj.imdbId}`;
    const maybetrailerUrl = bndsj?.short?.trailer?.embedUrl || undefined;
    let titleEmojie = "🎪";
    if (bndsj?.main?.isAdult === true) {
        titleEmojie = "🔞";
    }
    pct += `<a href='${bndsj.fake["#IMG_POSTER"] ?? ""}'>${titleEmojie}</a>`;
    if (bndsj.short.name) {
        pct += ` <b>${bndsj.short["@type"]}</b>: <a href='${imdbUrl}'>${
            bndsj.fake["#TITLE"]
        }</a>`;
    }
    if (bndsj.fake["#YEAR"]) {
        pct += " <i>(" + bndsj.fake["#YEAR"] + ")</i> ";
    }
    pct += "\n";
    if (bndsj.short.aggregateRating) {
        pct +=
            `🏆 <b>Usᴇʀ Rᴀᴛɪɴɢs</b>: <b>${bndsj.short?.aggregateRating?.ratingValue} / ${bndsj.short?.aggregateRating?.bestRating}</b> `;
        pct +=
            ` <code>(${bndsj.short?.aggregateRating?.ratingValue} based on ${bndsj?.short?.aggregateRating?.ratingCount} user ratings)</code>`;
    }
    if (bndsj.short.contentRating) {
        pct += ` | <code>${bndsj?.short?.contentRating}</code>`;
    }
    pct += "\n";

    pct += `🚦 <b>𝙸ᴍᴅʙ 𝙸ᴅ</b>: <code>${bndsj.imdbId}</code>\n`;

    if (bndsj.short.duration) {
        const duration = bndsj.short.duration;

        let seconds: number = bndsj.main.runtime.seconds;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        minutes = minutes % 60;
        seconds = seconds & 60;

        const durationFmt2: string = `${Math.floor(hours)}h ${minutes}min`;
        minutes = (hours * 60) + minutes;
        const durationFmt3: string = `${Math.round(minutes)}min`;

        pct +=
            `🕰<b>Dᴜʀᴀᴛɪᴏɴ</b>: <code>${durationFmt2}</code> | <b>${durationFmt3}</b>\n`;
    }
    if (bndsj.short.datePublished) {
        pct +=
            `🗓️ <b>Rᴇʟᴇᴀsᴇ Dᴀᴛᴇ</b>: <a href='${imdbUrl}/releaseinfo'>${bndsj.short.datePublished}</a>`;
        pct += "\n";
    }

    let fakeLanguage: string = "";
    if (bndsj?.main?.spokenLanguages?.spokenLanguages) {
        bndsj.main.spokenLanguages.spokenLanguages.forEach(
            (spokenLangElem: any) => {
                fakeLanguage += `#${spokenLangElem.text} `;
            },
        );
    }
    if (fakeLanguage !== "") {
        pct += `💬 <b>Lᴀɴɢᴜᴀɢᴇ</b>: ${fakeLanguage}\n`;
    }
    if (bndsj.short.genre) {
        pct += `📟 <b>Gᴇɴʀᴇ</b>: #${bndsj.short.genre.join(" #")}\n`;
    }

    if (bndsj.short.description) {
        pct += `📋 <b>Sᴛᴏʀy Lɪɴᴇ</b>: <tg-spoiler>${
            bndsj.short.description?.substring(0, 750)
        } <a href='${imdbUrl}/plotsummary/'>...</a></tg-spoiler>\n`;
    }

    const SEND_ACTOR_INFO_LIMIT = 5;
    let i = 0;
    const directors = bndsj?.main?.directors || [];
    if (directors.length > 0) {
        pct += `🎥 <b>Dɪʀᴇᴄᴛᴏʀ</b>: `;
        for (i = 0; i < directors[0].credits.length; i++) {
            if (i > SEND_ACTOR_INFO_LIMIT) {
                break;
            }
            const director = directors[0].credits[i];
            if (director.name) {
                pct +=
                    `<a href='${imdbBaseUrl}/name/${director.name.id}/'>${director.name.nameText.text}</a> `;
            }
        }
        pct += `\n`;
    }
    i = 0;

    // TODO

    const writers = bndsj?.main?.writers || [];
    if (writers.length > 0) {
        pct += `✍️ <b>Wʀɪᴛᴇʀ</b>: `;
        for (i = 0; i < writers[0].credits.length; i++) {
            if (i > SEND_ACTOR_INFO_LIMIT) {
                break;
            }
            const writer = writers[0].credits[i];
            if (writer.name) {
                pct +=
                    `<a href='${imdbBaseUrl}/name/${writer.name.id}/'>${writer.name.nameText.text}</a> `;
            }
        }
        pct += `\n`;
    }
    i = 0;

    const casts = bndsj?.main?.cast?.edges || [];
    if (casts.length > 0) {
        pct += `🎎 <b>Aᴄᴛᴏʀs</b>: `;
        for (i = 0; i < casts.length; i++) {
            if (i > SEND_ACTOR_INFO_LIMIT) {
                break;
            }
            const cast = casts[i];
            if (cast.node) {
                if (cast.node.name) {
                    pct +=
                        `<a href='${imdbBaseUrl}/name/${cast.node.name.id}/'>${cast.node.name.nameText.text}</a> `;
                }
            }
        }
        pct += `\n`;
    }
    i = 0;

    return {
        text: pct,
    };
}
