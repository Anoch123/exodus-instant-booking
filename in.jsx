<div className="main-header">
			<div className="logo-header">
				<a href="index.html" className="logo">
					Ready Dashboard
				</a>
				<button className="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<button className="topbar-toggler more"><i className="la la-ellipsis-v"></i></button>
			</div>
			<nav className="navbar navbar-header navbar-expand-lg">
				<div className="container-fluid">
					
					<form className="navbar-left navbar-form nav-search mr-md-3" action="">
						<div className="input-group">
							<input type="text" placeholder="Search ..." className="form-control"/>
							<div className="input-group-append">
								<span className="input-group-text">
									<i className="la la-search search-icon"></i>
								</span>
							</div>
						</div>
					</form>
					<ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
						<li className="nav-item dropdown hidden-caret">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i className="la la-envelope"></i>
							</a>
							<div className="dropdown-menu" aria-labelledby="navbarDropdown">
								<a className="dropdown-item" href="#">Action</a>
								<a className="dropdown-item" href="#">Another action</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item" href="#">Something else here</a>
							</div>
						</li>
						<li className="nav-item dropdown hidden-caret">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i className="la la-bell"></i>
								<span className="notification">3</span>
							</a>
							<ul className="dropdown-menu notif-box" aria-labelledby="navbarDropdown">
								<li>
									<div className="dropdown-title">You have 4 new notification</div>
								</li>
								<li>
									<div className="notif-center">
										<a href="#">
											<div className="notif-icon notif-primary"> <i className="la la-user-plus"></i> </div>
											<div className="notif-content">
												<span className="block">
													New user registered
												</span>
												<span className="time">5 minutes ago</span> 
											</div>
										</a>
										<a href="#">
											<div className="notif-icon notif-success"> <i className="la la-comment"></i> </div>
											<div className="notif-content">
												<span className="block">
													Rahmad commented on Admin
												</span>
												<span className="time">12 minutes ago</span> 
											</div>
										</a>
										<a href="#">
											<div className="notif-img"> 
												<img src="assets/img/profile2.jpg" alt="Img Profile"/>
											</div>
											<div className="notif-content">
												<span className="block">
													Reza send messages to you
												</span>
												<span className="time">12 minutes ago</span> 
											</div>
										</a>
										<a href="#">
											<div className="notif-icon notif-danger"> <i className="la la-heart"></i> </div>
											<div className="notif-content">
												<span className="block">
													Farrah liked Admin
												</span>
												<span className="time">17 minutes ago</span> 
											</div>
										</a>
									</div>
								</li>
								<li>
									<a className="see-all" href="javascript:void(0);"> <strong>See all notifications</strong> <i className="la la-angle-right"></i> </a>
								</li>
							</ul>
						</li>
						<li className="nav-item dropdown">
							<a className="dropdown-toggle profile-pic" data-toggle="dropdown" href="#" aria-expanded="false"> <img src="assets/img/profile.jpg" alt="user-img" width="36" className="img-circle"/><span >Hizrian</span> </a>
							<ul className="dropdown-menu dropdown-user">
								<li>
									<div className="user-box">
										<div className="u-img"><img src="assets/img/profile.jpg" alt="user"/></div>
										<div className="u-text">
											<h4>Hizrian</h4>
											<p className="text-muted">hello@themekita.com</p><a href="profile.html" className="btn btn-rounded btn-danger btn-sm">View Profile</a></div>
										</div>
									</li>
									<div className="dropdown-divider"></div>
									<a className="dropdown-item" href="#"><i className="ti-user"></i> My Profile</a>
									<a className="dropdown-item" href="#">My Balance</a>
									<a className="dropdown-item" href="#"><i className="ti-email"></i> Inbox</a>
									<div className="dropdown-divider"></div>
									<a className="dropdown-item" href="#"><i className="ti-settings"></i> Account Setting</a>
									<div className="dropdown-divider"></div>
									<a className="dropdown-item" href="#"><i className="fa fa-power-off"></i> Logout</a>
								</ul>
							</li>
						</ul>
					</div>
				</nav>
			</div>
			<div className="sidebar">
				<div className="scrollbar-inner sidebar-wrapper">
					<div className="user">
						<div className="photo">
							<img src="assets/img/profile.jpg"/>
						</div>
						<div className="info">
							<a className="" data-toggle="collapse" href="#collapseExample" aria-expanded="true">
								<span>
									Hizrian
									<span className="user-level">Administrator</span>
									<span className="caret"></span>
								</span>
							</a>
							<div className="clearfix"></div>

							<div className="collapse in" id="collapseExample" aria-expanded="true" style="">
								<ul className="nav">
									<li>
										<a href="#profile">
											<span className="link-collapse">My Profile</span>
										</a>
									</li>
									<li>
										<a href="#edit">
											<span className="link-collapse">Edit Profile</span>
										</a>
									</li>
									<li>
										<a href="#settings">
											<span className="link-collapse">Settings</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<ul className="nav">
						<li className="nav-item active">
							<a href="index.html">
								<i className="la la-dashboard"></i>
								<p>Dashboard</p>
								<span className="badge badge-count">5</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="components.html">
								<i className="la la-table"></i>
								<p>Components</p>
								<span className="badge badge-count">14</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="forms.html">
								<i className="la la-keyboard-o"></i>
								<p>Forms</p>
								<span className="badge badge-count">50</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="tables.html">
								<i className="la la-th"></i>
								<p>Tables</p>
								<span className="badge badge-count">6</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="notifications.html">
								<i className="la la-bell"></i>
								<p>Notifications</p>
								<span className="badge badge-success">3</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="typography.html">
								<i className="la la-font"></i>
								<p>Typography</p>
								<span className="badge badge-danger">25</span>
							</a>
						</li>
						<li className="nav-item">
							<a href="icons.html">
								<i className="la la-fonticons"></i>
								<p>Icons</p>
							</a>
						</li>
						<li className="nav-item update-pro">
							<button  data-toggle="modal" data-target="#modalUpdate">
								<i className="la la-hand-pointer-o"></i>
								<p>Update To Pro</p>
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="main-panel">
				<div className="content">
					<div className="container-fluid">
						<h4 className="page-title">Dashboard</h4>
						<div className="row">
							<div className="col-md-3">
								<div className="card card-stats card-warning">
									<div className="card-body ">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-users"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Visitors</p>
													<h4 className="card-title">1,294</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats card-success">
									<div className="card-body ">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-bar-chart"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Sales</p>
													<h4 className="card-title">$ 1,345</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats card-danger">
									<div className="card-body">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-newspaper-o"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Subscribers</p>
													<h4 className="card-title">1303</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats card-primary">
									<div className="card-body ">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-check-circle"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Order</p>
													<h4 className="card-title">576</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats">
									<div className="card-body ">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center icon-warning">
													<i className="la la-pie-chart text-warning"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Number</p>
													<h4 className="card-title">150GB</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats">
									<div className="card-body ">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-bar-chart text-success"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Revenue</p>
													<h4 className="card-title">$ 1,345</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats">
									<div className="card-body">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-times-circle-o text-danger"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Errors</p>
													<h4 className="card-title">23</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats">
									<div className="card-body">
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-heart-o text-primary"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Followers</p>
													<h4 className="card-title">+45K</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-3">
								<div className="card">
									<div className="card-header">
										<h4 className="card-title">Task</h4>
										<p className="card-category">Complete</p>
									</div>
									<div className="card-body">
										<div id="task-complete" className="chart-circle mt-4 mb-3"></div>
									</div>
									<div className="card-footer">
										<div className="legend"><i className="la la-circle text-primary"></i> Completed</div>
									</div>
								</div>
							</div>
							<div className="col-md-9">
								<div className="card">
									<div className="card-header">
										<h4 className="card-title">World Map</h4>
										<p className="card-category">
										Map of the distribution of users around the world</p>
									</div>
									<div className="card-body">
										<div className="mapcontainer">
											<div className="map">
												<span>Alternative content for the map</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row row-card-no-pd">
							<div className="col-md-4">
								<div className="card">
									<div className="card-body">
										<p className="fw-bold mt-1">My Balance</p>
										<h4><b>$ 3,018</b></h4>
										<a href="#" className="btn btn-primary btn-full text-left mt-3 mb-3"><i className="la la-plus"></i> Add Balance</a>
									</div>
									<div className="card-footer">
										<ul className="nav">
											<li className="nav-item"><a className="btn btn-default btn-link" href="#"><i className="la la-history"></i> History</a></li>
											<li className="nav-item ml-auto"><a className="btn btn-default btn-link" href="#"><i className="la la-refresh"></i> Refresh</a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="col-md-5">
								<div className="card">
									<div className="card-body">
										<div className="progress-card">
											<div className="d-flex justify-content-between mb-1">
												<span className="text-muted">Profit</span>
												<span className="text-muted fw-bold"> $3K</span>
											</div>
											<div className="progress mb-2" style="height: 7px;">
												<div className="progress-bar bg-success" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100" data-toggle="tooltip" data-placement="top" title="78%"></div>
											</div>
										</div>
										<div className="progress-card">
											<div className="d-flex justify-content-between mb-1">
												<span className="text-muted">Orders</span>
												<span className="text-muted fw-bold"> 576</span>
											</div>
											<div className="progress mb-2" style="height: 7px;">
												<div className="progress-bar bg-info" role="progressbar" style="width: 65%" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" data-toggle="tooltip" data-placement="top" title="65%"></div>
											</div>
										</div>
										<div className="progress-card">
											<div className="d-flex justify-content-between mb-1">
												<span className="text-muted">Tasks Complete</span>
												<span className="text-muted fw-bold"> 70%</span>
											</div>
											<div className="progress mb-2" style="height: 7px;">
												<div className="progress-bar bg-primary" role="progressbar" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" data-toggle="tooltip" data-placement="top" title="70%"></div>
											</div>
										</div>
										<div className="progress-card">
											<div className="d-flex justify-content-between mb-1">
												<span className="text-muted">Open Rate</span>
												<span className="text-muted fw-bold"> 60%</span>
											</div>
											<div className="progress mb-2" style="height: 7px;">
												<div className="progress-bar bg-warning" role="progressbar" style="width: 60%" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" data-toggle="tooltip" data-placement="top" title="60%"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-3">
								<div className="card card-stats">
									<div className="card-body">
										<p className="fw-bold mt-1">Statistic</p>
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center icon-warning">
													<i className="la la-pie-chart text-warning"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Number</p>
													<h4 className="card-title">150GB</h4>
												</div>
											</div>
										</div>
										<hr/>
										<div className="row">
											<div className="col-5">
												<div className="icon-big text-center">
													<i className="la la-heart-o text-primary"></i>
												</div>
											</div>
											<div className="col-7 d-flex align-items-center">
												<div className="numbers">
													<p className="card-category">Followers</p>
													<h4 className="card-title">+45K</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<div className="card">
									<div className="card-header">
										<h4 className="card-title">Users Statistics</h4>
										<p className="card-category">
										Users statistics this month</p>
									</div>
									<div className="card-body">
										<div id="monthlyChart" className="chart chart-pie"></div>
									</div>
								</div>
							</div>
							<div className="col-md-8">
								<div className="card">
									<div className="card-header">
										<h4 className="card-title">2018 Sales</h4>
										<p className="card-category">
										Number of products sold</p>
									</div>
									<div className="card-body">
										<div id="salesChart" className="chart"></div>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="card">
									<div className="card-header ">
										<h4 className="card-title">Table</h4>
										<p className="card-category">Users Table</p>
									</div>
									<div className="card-body">
										<table className="table table-head-bg-success table-striped table-hover">
											<thead>
												<tr>
													<th scope="col">#</th>
													<th scope="col">First</th>
													<th scope="col">Last</th>
													<th scope="col">Handle</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>1</td>
													<td>Mark</td>
													<td>Otto</td>
													<td>@mdo</td>
												</tr>
												<tr>
													<td>2</td>
													<td>Jacob</td>
													<td>Thornton</td>
													<td>@fat</td>
												</tr>
												<tr>
													<td>3</td>
													<td colspan="2">Larry the Bird</td>
													<td>@twitter</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="card card-tasks">
									<div className="card-header ">
										<h4 className="card-title">Tasks</h4>
										<p className="card-category">To Do List</p>
									</div>
									<div className="card-body ">
										<div className="table-full-width">
											<table className="table">
												<thead>
													<tr>
														<th>
															<div className="form-check">
																<label className="form-check-label">
																	<input className="form-check-input  select-all-checkbox" type="checkbox" data-select="checkbox" data-target=".task-select"/>
																	<span className="form-check-sign"></span>
																</label>
															</div>
														</th>
														<th>Task</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															<div className="form-check">
																<label className="form-check-label">
																	<input className="form-check-input task-select" type="checkbox"/>
																	<span className="form-check-sign"></span>
																</label>
															</div>
														</td>
														<td>Planning new project structure</td>
														<td className="td-actions text-right">
															<div className="form-button-action">
																<button type="button" data-toggle="tooltip" title="Edit Task" className="btn btn-link <btn-simple-primary">
																	<i className="la la-edit"></i>
																</button>
																<button type="button" data-toggle="tooltip" title="Remove" className="btn btn-link btn-simple-danger">
																	<i className="la la-times"></i>
																</button>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="form-check">
																<label className="form-check-label">
																	<input className="form-check-input task-select" type="checkbox"/>
																	<span className="form-check-sign"></span>
																</label>
															</div>
														</td>
														<td>Update Fonts</td>
														<td className="td-actions text-right">
															<div className="form-button-action">
																<button type="button" data-toggle="tooltip" title="Edit Task" className="btn btn-link <btn-simple-primary">
																	<i className="la la-edit"></i>
																</button>
																<button type="button" data-toggle="tooltip" title="Remove" className="btn btn-link btn-simple-danger">
																	<i className="la la-times"></i>
																</button>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="form-check">
																<label className="form-check-label">
																	<input className="form-check-input task-select" type="checkbox"/>
																	<span className="form-check-sign"></span>
																</label>
															</div>
														</td>
														<td>Add new Post
														</td>
														<td className="td-actions text-right">
															<div className="form-button-action">
																<button type="button" data-toggle="tooltip" title="Edit Task" className="btn btn-link <btn-simple-primary">
																	<i className="la la-edit"></i>
																</button>
																<button type="button" data-toggle="tooltip" title="Remove" className="btn btn-link btn-simple-danger">
																	<i className="la la-times"></i>
																</button>
															</div>
														</td>
													</tr>
													<tr>
														<td>
															<div className="form-check">
																<label className="form-check-label">
																	<input className="form-check-input task-select" type="checkbox"/>
																	<span className="form-check-sign"></span>
																</label>
															</div>
														</td>
														<td>Finalise the design proposal</td>
														<td className="td-actions text-right">
															<div className="form-button-action">
																<button type="button" data-toggle="tooltip" title="Edit Task" className="btn btn-link <btn-simple-primary">
																	<i className="la la-edit"></i>
																</button>
																<button type="button" data-toggle="tooltip" title="Remove" className="btn btn-link btn-simple-danger">
																	<i className="la la-times"></i>
																</button>
															</div>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<div className="card-footer ">
										<div className="stats">
											<i className="now-ui-icons loader_refresh spin"></i> Updated 3 minutes ago
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* footer code goes here */}
			</div>
		</div>