import { banner } from '@vue/components/banner/banner';
import { loader } from '@vue/components/loader/loader';
import fetcherService from '@base/services/fetcher/fetcher';
import template from './fetcher.html';

export const fetcher = {
  name: 't-fetcher',
  components: {
    tBanner: banner,
    tLoader: loader
  },
  props: [
    'onFetch',
    'onFetchSuccess',
    'onFetchError',
    'fetchErrorMessage'
  ],
  data(){
    return {
      fetcher: null,
      isFetching: false,
      fetchFailed: false,
      banner: null
    };
  },
  created(){
    this.setFetcher(fetcherService.build({
      onFetch: () => this.handleCallbackProp(this.onFetch),
      onFetchSuccess: response => this.handleCallbackProp(this.onFetchSuccess, response),
      onFetchError: () => this.handleFetchError(this.onFetchError),
      onProcessChange: this.handleProccess
    }));
  },
  methods: {
    handleProccess({ isFetching, fetchFailed }){
      this.setFetching(isFetching);
      this.setFetchFailed(fetchFailed);
      if(isFetching) this.setBanner(null);
    },
    handleFetchError(callback){
      this.setBanner({
        message: this.getBannerMessage(),
        onTriggerClick: () => this.fetcher.fetch()
      });
      this.handleCallbackProp(callback);
    },
    handleCallbackProp(callback, data){
      return callback && callback(data);
    },
    setFetcher(fetcher){
      this.fetcher = fetcher;
    },
    setFetching(isFetching){
      this.isFetching = isFetching;
    },
    setFetchFailed(hasFailed){
      this.fetchFailed = hasFailed;
    },
    setBanner(banner){
      this.banner = banner;
    },
    getBannerMessage(){
      return this.fetchErrorMessage || fetcherService.getMessage('FETCH_ERROR_MESSAGE');
    }
  },
  computed: {
    classes(){
      const { isFetching, fetchFailed } = this;
      return fetcherService.buildCssClasses({ fetching: isFetching, fetchFailed });
    },
    isBusy(){
      return this.isFetching ? 'true' : 'false';
    }
  },
  template
};