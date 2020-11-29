<template>
	<div class="app-container">
		<div>
			<FilenameOption v-model="filename" />
			<AutoWidthOption v-model="autoWidth" />
			<BookTypeOption v-model="bookType" />
			<el-button
				:loading="downloadLoading"
				style="margin: 0 0 20px 20px"
				type="primary"
				icon="el-icon-document"
				@click="handleDownload"
			>
				Export Excel
			</el-button>
		</div>

		<el-table
			v-loading="listLoading"
			:data="list"
			element-loading-text="Loading..."
			border
			fit
			highlight-current-row
		>
			<el-table-column align="center" label="Id" width="95">
				<template slot-scope="scope">
					{{ scope.$index + 1 }}
				</template>
			</el-table-column>
			<el-table-column label="Name">
				<template slot-scope="scope">
					<span class="link-type" @click="handleFetchUser(scope.row)">
						{{ scope.row.profile.first_name }} {{ scope.row.profile.last_name }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="Event Title">
				<template slot-scope="scope">
					{{ scope.row.event_name }}
				</template>
			</el-table-column>
			<el-table-column label="Package Name" width="130" align="center">
				<template slot-scope="scope">
					{{ scope.row.package_name }}
				</template>
			</el-table-column>
			<el-table-column label="Start Date" width="115" align="center">
				<template slot-scope="scope">
					<i class="el-icon-date" />
					{{ scope.row.start_date | dateFormater }}
				</template>
			</el-table-column>
			<el-table-column label="End Date" width="115" align="center">
				<template slot-scope="scope">
					<i class="el-icon-date" />
					<span> {{ scope.row.end_date | dateFormater }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Approx. Count" width="150" align="center">
				<template slot-scope="scope">
					{{ scope.row.approx_count }}
				</template>
			</el-table-column>
			<el-table-column label="Hall" width="110" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.hall | hallFilter">
						{{ scope.row.hall ? "Yes" : "No" }}</el-tag
					>
				</template>
			</el-table-column>
			<el-table-column label="Details" width="110" align="center">
				<template slot-scope="scope">
					<span class="link-type" @click="handleFetchMore(scope.row)">
						More
					</span>
				</template>
			</el-table-column>
			<el-table-column label="Status" width="110" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status | statusFilter">{{
						scope.row.status
					}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column align="center" label="Update Status" width="400">
				<template slot-scope="scope">
					<el-button-group>
						<el-tooltip
							class="item"
							effect="dark"
							content="Completed"
							placement="top"
						>
							<el-button
								type="primary"
								icon="el-icon-star-on"
								@click.prevent="updateStatus(scope.row._id, 'completed')"
							></el-button>
						</el-tooltip>
						<el-tooltip
							class="item"
							effect="dark"
							content="Confirmed"
							placement="top"
						>
							<el-button
								type="success"
								icon="el-icon-success"
								@click.prevent="updateStatus(scope.row._id, 'confirmed')"
							></el-button>
						</el-tooltip>
						<el-tooltip
							class="item"
							effect="dark"
							content="Pending"
							placement="top"
						>
							<el-button
								type="warning"
								icon="el-icon-warning"
								@click.prevent="updateStatus(scope.row._id, 'pending')"
							></el-button>
						</el-tooltip>
						<el-tooltip
							class="item"
							effect="dark"
							content="Canceled"
							placement="top"
						>
							<el-button
								type="danger"
								icon="el-icon-error"
								@click.prevent="updateStatus(scope.row._id, 'canceled')"
							></el-button>
						</el-tooltip>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="fetchData"
		/>
		<el-dialog
			:visible.sync="dialogUserVisible"
			:title="selected.length != 0 ? selected.profile.first_name : 'User'"
			width="30%"
		>
			<p>Email : {{ selected.profile.email }}</p>
			<p>Phone : {{ selected.profile.phone }}</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogUserVisible = false"
					>Close</el-button
				>
			</span>
		</el-dialog>
		<el-dialog
			:visible.sync="dialogMoreVisible"
			title="More Details"
			width="30%"
		>
			<p>
				Address : {{ selected.address_line_1 }}, {{ selected.address_line_1 }}
			</p>
			<p>City : {{ selected.city }}</p>
			<p>State : {{ selected.state }}</p>
			<p>Pincode : {{ selected.pincode }}</p>
			<p>Message : {{ selected.message }}</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogMoreVisible = false"
					>Close</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { fetchList, statusUpdateBooking } from "@/api/bookings";
import { parseTime } from "@/utils";
// options components
import FilenameOption from "./components/FilenameOption";
import AutoWidthOption from "./components/AutoWidthOption";
import BookTypeOption from "./components/BookTypeOption";
import Pagination from "@/components/Pagination";

export default {
	name: "BookingList",
	components: { FilenameOption, AutoWidthOption, BookTypeOption, Pagination },
	data() {
		return {
			list: null,
			listLoading: true,
			total: 0,
			listQuery: {
				page: 1,
				limit: 10,
			},
			downloadLoading: false,
			filename: "",
			autoWidth: true,
			bookType: "xlsx",
			selected: {
				profile: {
					first_name: "",
					last_name: "",
					email: "",
					phone: "",
				},
				address_line_1: "",
				address_line_2: "",
				city: "",
				state: "",
				pincode: "",
			},
			dialogUserVisible: false,
			dialogMoreVisible: false,
		};
	},
	created() {
		this.fetchData();
	},
	filters: {
		dateFormater: function (value) {
			var timeStr = value;
			var intermediate = timeStr.split("T");
			var newStr =
				intermediate[0].split("-").join("/") +
				" " +
				intermediate[1].split(".")[0] +
				" GMT";
			var newDate = new Date(newStr);
			var newFormat =
				1 +
				newDate.getUTCMonth() +
				"/" +
				newDate.getUTCDate() +
				"/" +
				newDate.getFullYear();
			return newFormat;
		},
		statusFilter(status) {
			const statusMap = {
				confirmed: "success",
				completed: "info",
				canceled: "danger",
				pending: "warning",
			};
			return statusMap[status];
		},
		hallFilter(status) {
			return status ? "success" : "danger";
		},
	},
	methods: {
		fetchData() {
			this.listLoading = true;
			fetchList(this.listQuery).then((response) => {
				this.list = response.data;
				this.total = response.data.length;
				this.listLoading = false;
			});
		},
		handleDownload() {
			this.downloadLoading = true;
			import("@/vendor/Export2Excel").then((excel) => {
				const tHeader = [
					"Username",
					"Phone",
					"Email",
					"Event Name",
					"Package Name",
					"Start Date",
					"End Date",
					"Approx Count",
					"Hall",
					"Status",
				];
				const filterVal = [
					"profile.first_name",
					"profile.phone",
					"profile.email",
					"event_name",
					"package_name",
					"start_date",
					"end_date",
					"approx_count",
					"hall",
					"status",
				];
				const list = this.list;
				const data = this.formatJson(filterVal, list);
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: this.filename,
					autoWidth: this.autoWidth,
					bookType: this.bookType,
				});
				this.downloadLoading = false;
			});
		},
		formatJson(filterVal, jsonData) {
			return jsonData.map((v) =>
				filterVal.map((j) => {
					var splitted = j.split(".");
					var value = v;
					splitted.map((finder) => {
						if (finder === "start_date") {
							value = this.$options.filters.dateFormater(value[finder]);
						} else if (finder === "end_date") {
							value = this.$options.filters.dateFormater(value[finder]);
						} else {
							value = value[finder];
						}
					});
					v[j] = value;
					return v[j];
				})
			);
		},
		handleFetchUser(data) {
			this.selected = data;
			this.dialogUserVisible = true;
		},
		handleFetchMore(data) {
			this.selected = data;
			this.dialogMoreVisible = true;
		},
		async updateStatus(id, status) {
			var statusQuery = { status: status };
			await this.$confirm("Do you want to change status?")
				.then(async (_) => {
					this.listLoading = true;
					statusUpdateBooking(id, statusQuery).then((response) =>
						this.fetchData()
					);
					this.listLoading = false;
				})
				.catch();
		},
	},
};
</script>

<style>
.radio-label {
	font-size: 14px;
	color: #606266;
	line-height: 40px;
	padding: 0 12px 0 30px;
}
</style>
