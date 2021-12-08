<template>
	<div class="container is-fluid 	single-page-wrapper">
		<section class="section">
			<div class="hero-body">
				<span class="logo has-text-success">
					D.C
				</span>
			</div>
		</section>
		<section>
			<RouterLink to="/login" class="button mr-4">Login</RouterLink>
			<RouterLink to="/signup" class="button">Signup</RouterLink>
		</section>
	</div>
</template>

<script type="text/javascript">
export default {
	name: 'Welcome',
}
</script>

<style type="text/scss">
.logo {
	font-size: 6rem;
}
</style>
