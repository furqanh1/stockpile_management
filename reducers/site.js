import {
  SET_COUNT_SITE,
  FETCH_LOCATIONS_SUCCESS,
  FETCH_LOCATIONS_FAILURE,
  FETCH_ADMIN_SITES_SUCCESS,
  FETCH_ADMIN_SITES_FAILURE,
  SET_CURRENT_SITE_ID,
  SET_CURRENT_REPORT_ID,
  EDIT_ADMIN_SITES_SUCCESS,
  EDIT_ADMIN_SITES_FAILURE,
  DELETE_ADMIN_SITES_SUCCESS,
  DELETE_ADMIN_SITES_FAILURE,
  FETCH_ADMIN_PAGE_SITES_SUCCESS,

  FETCH_TIFF_FILE_SUCCESS,
  FETCH_TIFF_FILE_FAILURE,

} from '../actionTypes'

const initialState = {
  locations: null,
  currentSiteId: null,
  currentReportId: null,
  adminSites: null,
  pageSites: null,
  count: null,
  tiffFile: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_LOCATIONS_SUCCESS:
      return {
        ...state,
        locations: action.payload,
      }

    case FETCH_ADMIN_SITES_SUCCESS:
      return {
        ...state,
        adminSites: action.payload,
      }

    case FETCH_ADMIN_SITES_FAILURE:
      return initialState

    case SET_CURRENT_SITE_ID:
      return{
        ...state,
        currentSiteId: action.payload
      }
    case EDIT_ADMIN_SITES_SUCCESS:
      let tempSites = state.adminSites.map((item,index) => item.id == action.payload.id ? action.payload : item )
      return{
        ...state,
        adminSites: tempSites
      }
    case DELETE_ADMIN_SITES_SUCCESS:
      let tempSite = state.adminSites.filter(item => action.payload.id != item.id)
      return{
        ...state,
        adminSites: tempSite
      }
    case FETCH_ADMIN_PAGE_SITES_SUCCESS:
      return{
        ...state,
        pageSites: action.payload
      }

    case SET_CURRENT_REPORT_ID:
      return{
        ...state,
        currentReportId: action.payload
      }
    case SET_COUNT_SITE:
    return{
      ...state,
      count: action.payload,
    }

    case FETCH_TIFF_FILE_SUCCESS:
    return{
      ...state,
      tiffFile: action.payload,
    }

    case FETCH_TIFF_FILE_FAILURE:
      return initialState

    case FETCH_LOCATIONS_FAILURE:
      return initialState
  }

  return state
}
