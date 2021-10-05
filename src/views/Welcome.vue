<template>
	<div class="container is-fluid">
		<section class="section">
			<div class="hero-body">
				<p class="title mb-3">Welcome to Dual!</p>
				<p>
					<RouterLink to="/login">Login</RouterLink> |
					<RouterLink to="/signup">Signup</RouterLink>
				</p>
			</div>
		</section>
	</div>
</template>

<script type="text/javascript">
export default {
	name: 'Welcome',
}
</script>
