<template>
	<div class="createPost-container">
		<el-form
			ref="postForm"
			:model="postForm"
			class="form-container"
			label-position="left"
			label-width="100px"
		>
			<div class="createPost-main-container">
				<el-form-item
					style="margin-bottom: 30px"
					label="Title"
					prop="title"
					:rules="rules.title"
				>
					<el-input
						v-model="postForm.title"
						placeholder="Please input"
						:maxlength="100"
						required
					/>
				</el-form-item>

				<el-form-item
					style="margin-bottom: 30px"
					label="Description"
					prop="description"
					:rules="rules.description"
				>
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 4 }"
						placeholder="Please input"
						v-model="postForm.description"
						maxlength="300"
					>
					</el-input>
				</el-form-item>

				<el-form-item
					style="margin-bottom: 30px"
					label="Image"
					prop="image"
					:rules="rules.image"
				>
					<el-upload
						action="#"
						list-type="picture-card"
						:on-remove="handleRemove"
						:auto-upload="false"
						:on-change="handleChange"
						:file-list="fileList"
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>

				<el-form-item
					style="margin-bottom: 30px"
					label="Gallery"
					prop="gallery"
					:rules="rules.gallery"
				>
					<el-upload
						action="#"
						list-type="picture-card"
						:on-remove="handleGalleryRemove"
						:auto-upload="false"
						:on-change="handleGalleryChange"
						:file-list="galleryList"
						multiple
					>
						<i class="el-icon-plus" />
					</el-upload>
				</el-form-item>
				<el-form-item
					v-for="(pack, index) in postForm.packages"
					:label="index == 0 ? 'Packages' : ''"
					:key="pack.key"
				>
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>Package {{ index + 1 }}</span>
							<el-button
								v-show="index != 0"
								style="float: right; padding: 3px 0"
								type="text"
								@click.prevent="removePackage(pack)"
								>Delete</el-button
							>
						</div>
						<el-form-item
							label="Title"
							:prop="'packages.' + index + '.title'"
							:rules="{
								required: true,
								message: 'Packages can not be empty',
								trigger: 'blur',
							}"
						>
							<el-input v-model="pack.title"></el-input>
						</el-form-item>
						<el-form-item
							style="margin-top: 30px"
							label="Price"
							:prop="'packages.' + index + '.price'"
							:rules="[
								{
									required: true,
									message: 'Package Price can not be empty',
									trigger: 'blur',
								},
								{
									type: 'number',
									message: 'Package Price must be a number',
									trigger: 'blur',
								},
							]"
						>
							<el-input-number
								v-model="pack.price"
								controls-position="right"
								:min="100"
								:max="100000000"
								style="width: 100%"
							></el-input-number>
						</el-form-item>

						<el-form-item
							style="margin-top: 30px"
							v-for="(feature, position) in pack.features"
							:label="'Feature ' + addNum(position, 1)"
							:key="feature.key"
							:prop="'packages.' + index + '.features.' + position + '.title'"
							:rules="{
								required: true,
								message: 'Feature Title can not be empty',
								trigger: 'blur',
							}"
						>
							<el-input v-model="feature.title"></el-input>
							<el-button
								v-show="position != 0"
								style="float: right; padding: 3px 0"
								type="text"
								@click.prevent="removeFeature(pack, feature)"
								>Delete</el-button
							>
						</el-form-item>
						<el-form-item style="margin-top: 30px">
							<el-button @click="addFeature(pack)">New Feature</el-button>
						</el-form-item>
					</el-card>
				</el-form-item>
				<el-form-item>
					<el-button @click="addPackage">New Package</el-button>
				</el-form-item>
				<el-form-item style="margin-bottom: 30px" label="Featured">
					<el-switch
						v-model="postForm.featured"
						active-color="#13ce66"
						inactive-color="#ff4949"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitForm">{{
						loading ? "Submitting ..." : "Submit"
					}}</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>

<script>
import { createEvent } from "@/api/events";

export default {
	name: "EventDetail",
	data() {
		const validateRequire = (rule, value, callback) => {
			if (value === "") {
				this.$message({
					message: rule.field + " required",
					type: "error",
				});
				callback(new Error(rule.field));
			} else {
				callback();
			}
		};
		return {
			loading: false,
			postForm: {
				title: "",
				description: "",
				image: "",
				gallery: [],
				featured: true,
				packages: [
					{
						key: 1,
						title: "",
						price: 0,
						features: [
							{
								key: 1,
								title: "",
							},
						],
					},
				],
			},
			rules: {
				title: {
					required: true,
					message: "Title can not be empty",
					trigger: "blur",
				},
				description: {
					required: true,
					message: "Description can not be empty",
					trigger: "blur",
				},
				image: {
					required: true,
					message: "Image can not be empty",
					trigger: "blur",
				},
				gallery: {
					required: true,
					message: "Gallery can not be empty",
					trigger: "blur",
				},
			},
			tempRoute: {},
			fileList: [],
			galleryList: [],
		};
	},
	created() {
		this.tempRoute = Object.assign({}, this.$route);
		this.setPageTitle();
	},
	methods: {
		addNum(value, add) {
			return parseInt(value) + parseInt(add);
		},
		setPageTitle() {
			const title = "Add Event";
			document.title = title;
		},
		submitForm() {
			this.$refs.postForm.validate((valid) => {
				if (valid) {
					var packages = this.postForm.packages.map((item) => {
						var features = item.features.map((feature) => feature.title.toString());
						var pack = {
							title: item.title.toString(),
							price: parseInt(item.price),
							features: features,
						};
						return pack;
          });
					const formData = new FormData();
					formData.append("title", this.postForm.title);
					formData.append("description", this.postForm.description);
					formData.append("image", this.postForm.image.raw);
					this.postForm.gallery.map((gallery) => {
						formData.append("gallery", gallery);
						return;
					});

					formData.append("featured", this.postForm.featured);
					formData.append("packages", JSON.stringify(packages));
					this.loading = true;
					createEvent(formData).then((response) => {
						this.$refs.postForm.resetFields();
						this.$router.push("/events/list");
					});
					this.loading = false;
				} else {
					this.$notify({
						title: "Error",
						message: "Insert valid data",
						type: "error",
						duration: 2000,
					});
					return false;
				}
			});
		},
		handleRemove(file, fileList) {
			console.log(file);
			fileList.splice(0, fileList.length);
			this.fileList = [];
			this.postForm.image = "";
		},
		handleGalleryRemove(file, fileList) {
			console.log(file);
			this.postForm.gallery = [];
			this.galleryList = fileList;
			this.postForm.gallery = this.galleryList.map((fileItem) => {
				return fileItem.raw;
			});
		},
		handleChange(file, fileList) {
			this.fileList = fileList.slice(-1);
			this.postForm.image = this.fileList[0];
		},
		handleGalleryChange(file, fileList) {
			this.postForm.gallery = [];
			this.galleryList = fileList.slice(-6);
			this.postForm.gallery = this.galleryList.map((fileItem) => {
				return fileItem.raw;
			});
		},
		removePackage(item) {
			var index = this.postForm.packages.indexOf(item);
			if (index !== -1) {
				this.postForm.packages.splice(index, 1);
			}
		},
		addPackage() {
			this.postForm.packages.push({
				key: Date.now(),
				title: "",
				price: 0,
				features: [
					{
						key: 1,
						title: "",
					},
				],
			});
		},
		removeFeature(item, feature) {
			var index = this.postForm.packages.indexOf(item);
			var feature_index = this.postForm.packages[index].features.indexOf(
				feature
			);
			if (index !== -1) {
				this.postForm.packages[index].features.splice(feature_index, 1);
			}
		},
		addFeature(pack) {
			var index = this.postForm.packages.indexOf(pack);
			this.postForm.packages[index].features.push({
				key: Date.now(),
				title: "",
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
	position: relative;

	.createPost-main-container {
		padding: 40px 45px 20px 50px;

		.postInfo-container {
			position: relative;
			@include clearfix;
			margin-bottom: 10px;

			.postInfo-container-item {
				float: left;
			}
		}
	}

	.word-counter {
		width: 40px;
		position: absolute;
		right: 10px;
		top: 0px;
	}
}

.article-textarea ::v-deep {
	textarea {
		padding-right: 40px;
		resize: none;
		border: none;
		border-radius: 0px;
		border-bottom: 1px solid #bfcbd9;
	}
}
</style>
