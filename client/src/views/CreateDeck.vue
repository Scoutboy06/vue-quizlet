<template>
	<header>
		<div>
			<h1>Create a new set</h1>
			<button class="create-btn">Create</button>
		</div>

		<input
			type="text"
			class="meta-input"
			v-model="title"
			placeholder="Title"
			autocomplete="off"
		/>
		<input
			type="text"
			class="meta-input"
			v-model="description"
			placeholder="Description"
			autocomplete="off"
		/>

		<div></div>
	</header>

	<main ref="cards">
		<div
			v-for="(card, i) in cards"
			:key="card.id"
			:class="card === 'padder' ? 'padder' : 'card'"
		>
			<div v-if="card !== 'padder'" class="card-header">
				<p>{{ i }}</p>
				<div>
					<i class="icon" @mousedown="mouseDownHandler(card.id, $event)"
						>drag_handle</i
					>
					<i class="icon" @click="deleteCard(card.id, $event)"
						>delete_outline</i
					>
				</div>
			</div>
			<div v-if="card !== 'padder'" class="card-body">
				<input type="text" v-model="card.term" placeholder="Term" />
				<input type="text" v-model="card.definition" placeholder="Definition" />
			</div>
		</div>

		<div class="card dragging" v-if="isDragging" ref="draggedEl">
			<div class="card-header">
				<p>&nbsp;</p>
				<div>
					<i class="icon">drag_handle</i>
					<i class="icon">delete_outline</i>
				</div>
			</div>
			<div class="card-body">
				<input type="text" v-model="draggedCardData.term" placeholder="Term" />
				<input
					type="text"
					v-model="draggedCardData.definition"
					placeholder="Definition"
				/>
			</div>
		</div>

		<div class="card create-card" @click="createCard()">
			<i class="icon">add</i>
		</div>

		<button class="create-btn bottom">Create</button>
	</main>
</template>

<script>
const cardGenerator = (function* () {
	let i = 0;
	while (true) {
		yield {
			term: '',
			definition: '',
			id: i++,
			image: null,
		};
	}
})();

export default {
	name: 'CreateDeck',
	data() {
		return {
			title: '',
			description: '',
			cards: Array(3)
				.fill(null)
				.map(() => cardGenerator.next().value),
			isDragging: false,
			draggedElement: null,
			draggedCardData: null,
			cursorPos: null,
			padderIndex: null,
		};
	},
	methods: {
		createCard() {
			this.cards = [...this.cards, cardGenerator.next().value];
		},
		deleteCard(id, e) {
			e.target.parentElement.parentElement.parentElement.classList.add(
				'delete'
			);
			setTimeout(() => {
				this.cards = this.cards.filter(card => card.id !== id);
			}, 390);
		},
		mouseDownHandler(id, e) {
			this.isDragging = true;
			const cardEl = e.target.parentElement.parentElement.parentElement;

			const { x, y } = cardEl.getBoundingClientRect();
			const { clientX, clientY } = e;

			// The relative cursor position
			// So that the position on the draggable "ghost-card" is static
			this.cursorPos = {
				x: clientX - x,
				y: clientY - y,
			};

			// Insert the "padder"
			this.draggedCardData = this.cards.find(card => card.id == id);
			this.cards = this.cards.map((card, i) => {
				if (card.id === id) {
					this.padderIndex = i;
					return 'padder';
				}
				return card;
			});

			window.addEventListener('mousemove', this.mouseMoveHandler);
			window.addEventListener('mouseup', this.mouseUpHandler);
		},
		mouseMoveHandler(e) {
			const cardHeight = 160;
			const padderHeight = 100;
			const gap = 16;

			const { y: containerY } = this.$refs.cards.getBoundingClientRect();
			const mouseY = e.clientY - containerY;

			let newIndex = this.cards.length - 1;
			let y = 0;

			// Check the index that the padder should be in
			for (let i in this.cards) {
				const height = this.cards[i] === 'padder' ? padderHeight : cardHeight;
				if (this.cards[i] === 'padder') y += padderHeight;

				if (y + height * 0.5 >= mouseY) {
					newIndex = i;
					break;
				} else y += cardHeight;

				y += gap;
			}

			// Update the padder index if necessary
			if (newIndex !== this.padderIndex) {
				this.cards = this.cards.filter(card => card !== 'padder');

				const newCardsArr = [...this.cards];
				newCardsArr.splice(newIndex, 0, 'padder');
				this.cards = newCardsArr;

				this.padderIndex = newIndex;
			}

			// Update draggable "ghost-card" position
			this.$refs.draggedEl.style.left = `${e.clientX - this.cursorPos.x}px`;
			this.$refs.draggedEl.style.top = `${e.clientY - this.cursorPos.y}px`;

			// When mouse is on top of page, scroll upwards
			if (e.clientY < 100) window.scrollBy(0, -10);
			else if (e.clientY > window.innerHeight - 100) window.scrollBy(0, 10);
		},
		mouseUpHandler() {
			this.isDragging = false;

			this.cards = this.cards.map(card =>
				card === 'padder' ? this.draggedCardData : card
			);

			this.cursorPos = null;

			window.removeEventListener('mousemove', this.mouseMoveHandler);
			window.removeEventListener('mouseup', this.mouseUpHandler);
		},
	},
	unmounted() {
		window.removeEventListener('mousemove', this.mouseMoveHandler);
		window.removeEventListener('mouseup', this.mouseUpHandler);
	},
};
</script>

<style scoped>
@keyframes delete-card {
	0% {
		height: 10em;
		opacity: 1;
	}

	50% {
		height: 10em;
		opacity: 0;
	}

	100% {
		opacity: 0;
		height: 0em;
	}
}
.create-btn {
	font-size: 1.2em;
	padding: 0.4em 0.7em;
	background-color: var(--primary);
	border: 0;
}

.create-btn.bottom {
	width: max-content;
	align-self: flex-end;
	font-size: 1.5em;
}

header {
	padding: 4em 5vw;
}

header > div:first-child {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1em;
}
.meta-input {
	display: block;
	margin-bottom: 1em;
	font-size: 1.2em;
	padding: 0.3em;
	border: 0;
	border-bottom: 2px solid var(--darker-text);
	width: 500px;
	max-width: 100%;
	outline: none;
	background-color: transparent;
	transition: border-color 0.2s;
}
.meta-input:focus {
	border-bottom-color: var(--secondary);
}
main {
	padding: 0 5vw 3em;
	display: flex;
	flex-direction: column;
	row-gap: 16px;
}
.card {
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 0.5em;
	height: 10em;
}
.card.delete {
	animation: delete-card 0.4s ease-in-out forwards;
}
.card.dragging {
	opacity: 0.3;
	position: fixed;
	width: 90vw;
	pointer-events: none;
}
.padder {
	background-color: #0e0e0e;
	height: 100px;
	border-radius: 0.5em;
}
.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.2em 1em;
	border-bottom: 2px solid var(--background);
}
.card-header .icon {
	margin-left: 0.4em;
}
.card-header > div:last-child > .icon:last-child {
	cursor: pointer;
}
.card-header > div:last-child > .icon:first-child {
	cursor: move;
}

.card-body {
	padding: 2em 1em;
	display: flex;
	flex-direction: row;
	column-gap: 2em;
}
.card-body input[type='text'] {
	width: 100%;
	font-size: 1.1em;
	display: inline;
	position: relative;
	background-color: transparent;
	border: 0;
	border-bottom: 2px solid var(--darker-text);
	outline: none;
	padding: 0.3em;
	transition: border-bottom-color 0.2s;
	box-sizing: border-box;
}
.card-body input[type='text']:focus {
	border-bottom-color: var(--secondary);
}
.create-card {
	height: 6em;
	transition: background-color 0.2s;
	cursor: pointer;
	display: grid;
	place-items: center;
}
.create-card:hover {
	background-color: rgba(255, 255, 255, 0.2);
}
.create-card .icon {
	font-size: 3em;
}
</style>
