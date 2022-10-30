<template>
	<nav>
		<div>
			<router-link to="/">
				<img src="/vite.svg" id="logo" />
			</router-link>
			<router-link to="/" class="nav-link">Home</router-link>
			<router-link to="/decks" class="nav-link">Decks</router-link>
			<router-link to="/create" id="create-btn">
				Create set <i class="icon">add</i>
			</router-link>
		</div>

		<!-- <div></div> -->
	</nav>
</template>

<style scoped>
nav {
	height: 4em;
	padding: 0 1em;
	background-color: var(--background);
	border-bottom: 1px solid var(--darker-text);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

nav > div {
	display: flex;
	align-items: center;
	column-gap: 20px;
}

#logo {
	margin-right: 10px;
}

.nav-link {
	text-decoration: none;
	color: var(--text);
	position: relative;
}

.nav-link::after {
	content: '';
	width: 100%;
	height: 2px;
	position: absolute;
	left: 0;
	bottom: -6px;
	background-color: var(--text);
	opacity: 0;
	transition: opacity 0.2s;
}

.nav-link:hover::after {
	opacity: 1;
}

#create-btn {
	background-color: var(--primary);
	color: var(--text);
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 0.2em;
	padding: 0.4em 0.7em;
	border-radius: 0.3em;
}
</style>
