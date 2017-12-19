import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { withRouter, browserHistory } from 'react-router'
import Header from './Header'
import { destroy } from 'redux-form'
import AddSiteModal from './AddSiteModal'
import { DataTable } from 'react-data-components'
import { fetchPageAdminSites, deleteSiteRequest, fetchAdminSites } from '../../actions'
import SiteForm from './SiteForm'
import Pagination from 'react-js-pagination';
import {
  getPaginatedSites,
  getSitesCount,
  searchSites,
  isAdmin,
  isSpecial,
  isTechnician,
} from '../../selectors'

class PageSelect extends Component {
  change(event) {
    let val1 = event.target.value;
    this.props.onChange(val1)
  }
  render() {
    let data1 = [10, 20, 30, 40, 50]

    const row = data1.map((data) =>
      <option value={data}>{data}</option>
    );
    return(
      <select onChange={this.change.bind(this)} className="form-control">{row}</select>

    );
  }
}

class Sites extends Component {

  async componentWillMount() {
    let pages = {
      offset: 0,
      limit: 10
    }
    let tempo = await this.props.fetchAdminSites()
    let temp = await this.props.fetchPageAdminSites(pages)
    if(temp && tempo) {
      let showSites = await getPaginatedSites(this.props.currentState, 55, 0)
      let obj = await getSitesCount(this.props.currentState, 55)
      this.setState({
        sites: showSites,
        limit: 10,
        page: 0,
        obj: obj,
        activePage: 1,
      })
    }

  }

  async editSites(val, event) {
    let temp = await this.props.destroy('SiteForm')
    if(temp){
      this.setState({siteEdit: val})
    }
  }

  async edittedSites(event) {
    let showSites = await getPaginatedSites(this.props.currentState, 55, (this.state.page)*55)
    this.setState({
      siteEdit: null,
      sites: showSites,
    })
  }

  async deleteSites(val, event) {
    let temp = await this.props.deleteSiteRequest(val)
    if (temp) {
      let showSites = getPaginatedSites(this.props.currentState, 55, this.state.page*55)
      this.setState({
        sites: showSites,
      })
    }
  }

  showModal(e){
    $('#addSiteModal').modal('show')
  }

  changePage(val, event) {
    let showSites = getPaginatedSites(this.props.currentState, 55, val*55)
    this.setState({
      sites: showSites,
      offset: this.state.offset,
      page: val
    })
  }

  searchSites(event) {
    let showSites = searchSites(this.props.currentState, event.target.value)
    this.setState({
      sites: showSites
    })
  }

  async change1(val) {
    let pages = {
      offset: 0,
      limit: val
    }
    let temp = await this.props.fetchPageAdminSites(pages)
    if(temp) {
      let showSites = await getPaginatedSites(this.props.currentState, 55, 0)
      let obj = await getSitesCount(this.props.currentState, 55)
      this.setState({
        sites: showSites,
        limit: val,
        obj: obj,
        activePage: 1,
      })
    }
  }

  async handlePageChange(pageNumber) {
    let that = this
    let pages = {
      offset: (pageNumber-1)*10,
      limit: this.state.limit
    }
    let temp = await that.props.fetchPageAdminSites(pages)
    if(temp) {
      let showSites = await getPaginatedSites(this.props.currentState, 55, 0)
      let obj = await getSitesCount(this.props.currentState, 55)
      this.setState({
        sites: showSites,
        offset: pages.limit,
        page: pageNumber,
        obj: obj,
        activePage: pageNumber
      })
    }
    // this.setState({activePage: pageNumber});
  }

  render() {
    let allUsers = [],arr = []
    let n = 0
    if (this.props.adminSites) {
      allUsers = this.props.adminSites
      n = allUsers.length
    }
    const { admin ,special, currentState } = this.props
    let columns = [
      { title: 'Site Id', prop: 'id' },
      { title: 'Site Name', prop: 'name' },
    ]
    return (
      <div className="admin-con"  >
        <Header></Header>
        <div id="addSiteModal" className="modal fade" role="dialog">
          <AddSiteModal />
        </div>
        <div className="container-fluid">
          <div className="admin-subheader row">
           <div className="col-sm-4">
              <a onClick={this.showModal.bind(this)} className="btn blue-btn file-btn" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <i className="fa fa-plus"></i>  { " Add Site " }
              </a>
            </div>
            <div className="col-md-3 col-sm-4 pull-right">
              <div id="search-page" className="input-group merged-icon rounded">
                <span className="input-group-addon"><i className="fa fa-search"></i></span>
                <input type='text' placeholder="Search" className="form-control" onChange={this.searchSites.bind(this)} />
              </div>
            </div>
          </div>

          { !allUsers &&
            <div className="loader">
                <img src='/images/three-bar-loader.gif' />
                <h4> Please wait while we are crunching those numbers for you... </h4>
            </div>
          }

          { allUsers && <div>
          <div id="HTMLtoPDF" className="">
            <div className="panel panel-default main-table">
              <div className="panel-body">
                <div className="main-table sites-table">
                  <div className="table-responsive">
                    <div className="rt-table">
                      <div className="rt-thead">
                        <div className="rt-tr">
                          <div className="rt-th">Site Id</div>
                          <div className="rt-th">Site Name</div>
                          <div className="rt-th">Edit</div>
                        </div>
                      </div>

                      <div className="rt-tbody">
                        {this.state && this.state.sites && Object.entries(this.state.sites).map(([id, site],index) => this.renderRows(site, index))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h6>Per Page</h6>
          <div className='row pagination-con'>
            <div className='col-md-1 col-sm-2'>
              {<PageSelect onChange={this.change1.bind(this)} />}
            </div>

            <div className='col-md-10 col-sm-8 text-center'>
              {
                this.state && this.state.sites &&
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={this.state.limit}
                  totalItemsCount={currentState.site.count}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange.bind(this)}
                />
              }
            </div>
          </div>
         </div>
         }
        <div className="row" id="pager"></div>
      </div>

      </div>
    )
  }

  renderPages(pages) {
    let count = 1
    return(
      <div className="text-center">
        <ul className="pagination">
          <li className="disabled"><a href="#"><i className="fa fa-angle-left"></i></a></li>
            {_.times(pages, i =>
              <li key={i+1}>
                  <a href="javascript:void(0)" onClick={this.changePage.bind(this, i)}>{i+1}</a>
              </li>
            )}



          <li className="disabled"><a role="button" href="javascript:void(0)" tabindex="0" aria-disabled="false" aria-label="Next"><i className="fa fa-angle-right"></i></a></li>
        </ul>
      </div>
    )
  }

  renderRows(data, index) {
    return(
      <div className="rt-tr-group">
        {this.state && this.state.siteEdit && this.state.siteEdit == data.id && <SiteForm data={data} index={index} edittedSites={this.edittedSites.bind(this)}/> }
        {this.state && this.state.siteEdit != data.id && this.renderSimpleRow(data, index)}
        { !this.state && this.renderSimpleRow(data, index) }
      </div>
    )
  }

  renderSimpleRow(data, index) {
    const { admin ,special } = this.props
    return(
        <div className="rt-tr">
           <div className="rt-td id" key={data.id ? data.id : data.id+1 }>{data.id ? data.id : " "}</div>
          <div className="rt-td name" key={data.name ? data.name : data.id+2 }>{data.name ? data.name : " " }</div>

          <div className="rt-td">
            <div className="edit-delete clearfix">
              <div className="pull-right btns">
                <a href="#" className="btn blue-btn btn-with-icon">
                  <img src="../images/printer.svg" alt="" />
                  <span>Print</span>
                </a>
                { (special || admin) &&
                  <a href="javascript:void(0)" onClick={this.editSites.bind(this, data.id)} className="btn btn-icon">
                    <img src="../images/edit-report.svg" alt="" />
                  </a>
                }

                { special &&
                  <a href="javascript:void(0)" onClick={this.deleteSites.bind(this, data.id)} className="btn btn-icon red">
                    <img src="../images/cancel.svg" alt="" />
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentState: state,
     adminSites: state.site.adminSites,
     admin: isAdmin(state),
     special: isSpecial(state),
     technician: isTechnician(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPageAdminSites(arg1){return dispatch(fetchPageAdminSites(arg1))},
    deleteSiteRequest(arg1){return dispatch(deleteSiteRequest(arg1))},
    destroy(arg1){ return dispatch(destroy(arg1))},
    fetchAdminSites(){return dispatch(fetchAdminSites())}
  }
}

Sites = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sites)


export default withRouter(Sites)
