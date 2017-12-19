import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { withRouter, browserHistory } from 'react-router'
import Header from './Header'
import ReportForm from './ReportForm'
import AddReportModal from './AddReportModal'
import { fetchAdminReports, fetchAdminReportRevisions, deleteAdminReport, searchAllReports, setReportCount } from '../../actions'
import { getAdminReports, searchReports, isSpecial } from '../../selectors'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import Pagination from 'react-js-pagination';
import {NotificationContainer, NotificationManager} from 'react-notifications';
// require('/react-notifications/dist/notifications.css')
import Collapsible from 'react-collapsible';

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

class Home extends Component {
  constructor(props){
    super(props)
    // this.pdfToHTML=this.pdfToHTML.bind(this)
    // this.downloadExcel=this.downloadExcel.bind(this)
    this.setState({reportEdit: null})
  }

  async componentWillMount() {
    let pages = {
      offset: 0,
      limit: 10
    }
    let temp = await this.props.fetchAdminReports(pages)
    if(temp && temp > 0) {
      let showReports = await this.props.currentState.report.admin_items
      let count = await this.props.setReportCount(temp)
      if(count) {
        this.setState({
          showReports: showReports,
          activePage: 1,
          limit: 10,
          count: await this.props.currentState.report.count,
          page: 1
        })
      }
    }
  }

  checkHistory(val, event) {
    this.setState({checkHistory: val})
    window.addEventListener('mousedown', this.closeModal.bind(this), false)
    this.props.fetchAdminReportRevisions(val)
  }

  editReport(val, event) {
    this.setState({reportEdit: val})
  }

  showModal(e){
    $('#addReportModal').modal('show')
  }

  async addedCompany(event, val) {
    if(event.success == true) {
      let pages = {
        offset: (this.state.page-1)*this.state.limit,
        limit: this.state.limit
      }
      let temp = await this.props.fetchAdminReports(pages)
      if(temp) {
        let showReports = await this.props.currentState.report.admin_items
        this.setState({
          showReports: showReports,
          count:this.props.currentState.report.count,
        })
      }
      NotificationManager.success('Report has been created Successfully', 'Report Created');
    }else {
      NotificationManager.error('Report could not be created!', 'Report Error in Creation');
    }
  }


  closeModal(event) {
    if(($(event.target).hasClass('admin-right-panel')) || ($(event.target).parents('.admin-right-panel').length < 1) ){
      event.preventDefault()
      this.setState({ checkHistory: null })
    }
  }

  async searchReports(e) {
    if(e.target.value != ""){
      let params = {
        query: e.target.value,
        limit: this.state.limit,
        offset: 0,
      }
      let showReports = await this.props.searchAllReports(params)
      if(showReports){
        this.setState({
          showReports: this.props.currentState.report.search,
          query: params.query,
          search: true,
          count:this.props.currentState.report.count,
        })
      }
    }else {
      let pages = {
        offset: 0,
        limit: 10
      }
      let showReports = await this.props.fetchAdminReports(pages)
      if (showReports){
        this.setState({
          showReports: await this.props.currentState.report.admin_items,
          limit: 10,
          page: 0,
          activePage: 1,
          count:this.props.currentState.report.count,
          search: false,
        })
      }
    }
  }

  async change1(val) {

    if(this.state && this.state.search) {
      let pages = {
        query: this.state.query,
        offset: 0,
        limit: val
      }
      let wait = await this.props.searchAllReports(pages)
      if (wait){
        this.setState({
          showReports: this.props.currentState.report.search,
          limit: val,
          count:this.props.currentState.report.count,
          activePage: 1
        })
      }
    }else{
      let pages = {
        offset: 0,
        limit: val
      }
      let temp = await this.props.fetchAdminReports(pages)
      if(temp) {
        let showReports = await this.props.currentState.report.admin_items
        this.setState({
          showReports: showReports,
          count:this.props.currentState.report.count,
          limit: val,
          activePage: 1,
        })
      }
    }
  }

  async handlePageChange(pageNumber) {
    if(this.state && this.state.search) {
      let pages = {
        query: this.state.query,
        offset: (pageNumber-1)*10,
        limit: this.state.limit
      }
      let wait = await this.props.searchAllReports(pages)
      if (wait){
        this.setState({
          showReports: this.props.currentState.report.search,
          limit: pages.limit,
          page: pageNumber,
          count:this.props.currentState.report.count,
          activePage: pageNumber
        })
      }
    }else{
      let pages = {
        offset: (pageNumber-1)*10,
        limit: this.state.limit
      }
      let temp = await this.props.fetchAdminReports(pages)
      if(temp) {
        let showReports = await this.props.currentState.report.admin_items
        this.setState({
          showReports: showReports,
          count: this.props.currentState.report.count,
          activePage: pageNumber,
        })
      }
    }


    // this.setState({activePage: pageNumber});
  }

  async deleteReports(val, event) {
    let temp =  await this.props.deleteAdminReport(val)
    if(temp) {
      let pages = {
        offset: (this.state.page-1)*10,
        limit: this.state.limit
      }
      let yo = await this.props.fetchAdminReports(pages)
      if(yo) {
        let showReports = await this.props.currentState.report.admin_items
        this.setState({
          showReports: showReports,
          count: this.props.currentState.report.count,
        })
      }

    }
  }

  render() {
    const { currentState, reports, special } = this.props
    const columns = [{
      Header: 'Report Number',
      accessor: 'id',
      Cell: props => <Link to={'/admin/piles?id=' + props.original.id} >{props.original.id}</Link>,
      width: 'auto'
    }, {
      Header: 'Site Name',
      accessor: 'SiteName',
      width: 'auto'
    }, {
      Header: 'Company Name',
      accessor: 'CompanyName',
      width: 'auto'
    }, {
      Header: 'Date',
      accessor: 'Date',
      width: 'auto'
    },{
      Header: 'Print/Edit Report',
      Cell: props => <div className="edit-delete clearfix">
            <div className="pull-left edit-by">
              <p>Last {props.original.reportRevision && props.original.reportRevision.action ? props.original.reportRevision.action : "not found"} by {props.original.reportRevision && props.original.reportRevision.addedBy ? props.original.reportRevision.addedBy : "not found"}</p>
              <div className="clearfix">
                <div className="pull-left time">
                  A moment ago
                </div>

                <div className="pull-right history">
                  <a href="javascript:void(0)" onClick={this.checkHistory.bind(this, props.original.id)}>View History</a>
                </div>
              </div>
            </div>

            <div className="pull-right btns">
              <a href="#" className="btn blue-btn btn-with-icon">
                <img src="images/printer.svg" alt="" />
                <span>Print</span>
              </a>

            </div>
          </div>,
      width: 'auto'
    }]
    let showReports = [],loaded = false
    if (this.state) {
      showReports = this.state.showReports
      loaded = reports != undefined && showReports != undefined && this.state.count != undefined
    }
    return (
      <div>
      <div className="admin-con">
        <Header></Header>
        <div className="container-fluid">
          <div className="admin-subheader row">
            <div className="col-sm-4">
              <a onClick={this.showModal.bind(this)} className="btn blue-btn file-btn" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <i className="fa fa-plus"></i>  { " Add files " }
              </a>
            </div>
            <div className="col-md-3 col-sm-4 pull-right">
              <div className="input-group merged-icon rounded">
                <span className="input-group-addon"><i className="fa fa-search"></i></span>
                <input type='text' placeholder="Search" className="form-control" onChange={this.searchReports.bind(this)} />
              </div>
            </div>
          </div>
          <NotificationContainer/>
        { !loaded &&
          <div className="loader">
              <img src='/images/three-bar-loader.gif' />
              <h4> Please wait while we are crunching those numbers for you... </h4>
          </div>
        }
        </div>

        { loaded &&
        <div id="HTMLtoPDF" className="container-fluid">
          <div className="panel panel-default main-table">
            <div className="panel-body">
              <div className="table-responsive">
                <div className="rt-table">
                  <div className="rt-thead">
                    <div className="rt-tr">
                      <div className="rt-th">Report Number</div>
                      <div className="rt-th">Site Name</div>
                      <div className="rt-th">Company</div>
                      <div className="rt-th">Date</div>
                      <div className="rt-th">Print/Edit Report</div>
                    </div>
                  </div>
                  <div className="rt-tbody">
                    {this.state && this.state.showReports && Object.entries(this.state.showReports).map(([id, report],index) => this.renderRows(report, index))}
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
                    { this.state && this.state.showReports && <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={parseInt(this.state.limit)}
                      totalItemsCount={parseInt(this.state.count)}
                      pageRangeDisplayed={10}
                      onChange={this.handlePageChange.bind(this)}
                    /> }
                  </div>
                </div>


        </div>
        }
        {currentState.report.revisions && this.state.checkHistory && this.renderSideModal() }
      </div>


        <div id="addReportModal" className="modal fade" role="dialog">
          <AddReportModal addedCompany={this.addedCompany.bind(this)} />
        </div>

      </div>
    )
  }

  // renderHeader(data) {
  //   return(

  //   )
  // }

  renderSideModal() {
    const { currentState } = this.props
    return(
      <div className="admin-right-panel">
        <div className="admin-right-header">
          <img src="images/report-icon.svg" alt="" />
          <span>Report {this.state.checkHistory}</span>
        </div>

        <div className="admin-right-body">
          <div className="inner">
            <Collapsible trigger="Add a missing pile">
              <p>This is the collapsible content. It can be any element or React component you like.</p>
              <p>It can even be another Collapsible component. Check out the next section!</p>
            </Collapsible>

            <Collapsible trigger="Settings">
              <div className="accord-body">
                <div className="head clearfix">
                  <h5 className="pull-left">File Editing</h5>

                  <div className="pull-right">
                    <input type="checkbox" className="tgl tgl-light" id="tgl-1" />
                    <label htmlFor="tgl-1" className='tgl-btn'></label>
                  </div>
                </div>

                <div className="body">
                  <span className="info-txt">Turn on to share your file changes and updates</span>
                </div>
              </div>
            </Collapsible>

            <Collapsible trigger="Notifications">
              <div className="accord-body">
                <div className="head clearfix">
                  <h5 className="pull-left">Notifications</h5>

                  <div className="pull-right">
                    <input type="checkbox" className="tgl tgl-light" id="tgl-2" />
                    <label htmlFor="tgl-2" className='tgl-btn'></label>
                  </div>
                </div>

                <div className="body">
                  <span className="info-txt">Turn on to share your file changes and updates</span>
                </div>
              </div>
            </Collapsible>

            <Collapsible trigger="Recent Changes">
              {currentState.report.revisions && Object.keys(currentState.report.revisions).map(id => {
                const revision = currentState.report.revisions[id]
                return (
                  <div className="accord-body">
                    <div className="blue-dot-header">
                      <p></p>
                      <span></span>
                    </div>

                    <div className="clearfix report-changes">
                      <div className="report-label">Report Revision Number</div>
                      <div className="name">{revision.revison}</div>
                      <p>{revision.action}</p>
                      <p>by {revision.scannedBy}</p>
                      <Collapsible trigger="View Changes">
                        <div className="name">{revision.reportId}</div>
                        <p>action: {revision.action}</p>
                        <p>ReportId: {revision.ReportId}</p>
                        <p>SiteId: {revision.SiteId}</p>
                        <p>CompanyId: {revision.CompanyId}</p>
                        <p>revison: {revision.revison}</p>
                        <p>scannedBy: {revision.scannedBy}</p>
                        <p>processedBy: {revision.processedBy}</p>
                        <p>addedBy: {revision.addedBy}</p>

                        <div className="print"><a href="#">Print Changes</a></div>
                      </Collapsible>
                    </div>
                  </div>
                )
              })}
            </Collapsible>
          </div>
        </div>
      </div>
    )
  }

  renderRows(data, index) {
    return(
      <div className="rt-tr-group">
        {this.state && this.state.reportEdit && this.state.reportEdit == data.id && this.renderFormRow(data, index) }
        {this.state && this.state.reportEdit != data.id && this.renderSimpleRow(data, index)}
        { !this.state && this.renderSimpleRow(data, index) }
      </div>
    )
  }

  renderSimpleRow(data, index) {
    return(
      <div className="rt-tr">
        <div className="rt-td index" ><Link to={'/admin/piles?id=' + data.id} >{data.id}</Link></div>
        <div className="rt-td " >{data.SiteName}</div>
        <div className="rt-td " >{data.CompanyName}</div>
        <div className="rt-td " >{data.date}</div>

        <div className="rt-td " >
          <div className="edit-delete clearfix">
            <div className="pull-left edit-by">
              <p>Last Edit by Lauren Elmore</p>
              <div className="clearfix">
                <div className="pull-left time">
                  A moment ago
                </div>

                <div className="pull-right history">
                  <a href="javascript:void(0)" onClick={this.checkHistory.bind(this, data.id)}>View History</a>
                </div>
              </div>
            </div>

            <div className="pull-right btns">
              <a href="#" className="btn blue-btn btn-with-icon">
                <img src="images/printer.svg" alt="" />
                <span>Print</span>
              </a>

              <a href="javascript:void(0)" onClick={this.editReport.bind(this, data.id)} className="btn btn-icon">
                <img src="images/edit-report.svg" alt="" />
              </a>

              <a href="javascript:void(0)" onClick={this.deleteReports.bind(this, data.id)} className="btn btn-icon red">
                <img src="images/cancel.svg" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderFormRow(data, index) {
    return(
        <div>
        <td key={index}>{index+1}</td>
        <td key={data.id}><Link to={'/admin/piles?id=' + data.id} >{data.id}</Link></td>
        <td key={data.SiteName}>{data.SiteName}</td>
        <td key={data.CompanyName}>{data.CompanyName}</td>
        <td key={data.date}>{data.date}</td>

        <td key = {index+1}>
          <div className="edit-delete clearfix">
            <div className="pull-left edit-by">
              <p>Last Edit by Lauren Elmore</p>
              <div className="clearfix">
                <div className="pull-left time">
                  A moment ago
                </div>

                <div className="pull-right history">
                  <a href="javascript:void(0)" onClick={this.checkHistory.bind(this, data.id)}>View History</a>
                </div>
              </div>
            </div>

            <div className="pull-right btns">
              <a href="#" className="btn blue-btn btn-with-icon">
                <img src="images/printer.svg" alt="" />
                <span>Print</span>
              </a>

              <a href="javascript:void(0)" onClick={this.editReport.bind(this, data.id)} className="btn btn-icon">
                <img src="images/edit-report.svg" alt="" />
              </a>

              <a href="#" className="btn btn-icon red">
                <img src="images/cancel.svg" alt="" />
              </a>
            </div>
          </div>
        </td>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentState: state,
    special: isSpecial(state),
    reports: getAdminReports(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAdminReports(arg1){return dispatch(fetchAdminReports(arg1))},
    fetchAdminReportRevisions(arg1){ return dispatch(fetchAdminReportRevisions(arg1)) },
    deleteAdminReport(arg1){ return dispatch(deleteAdminReport(arg1)) },
    searchAllReports(arg1){return dispatch(searchAllReports(arg1))},
    setReportCount(arg1){return dispatch(setReportCount(arg1))}
  }
}


Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)


export default withRouter(Home)