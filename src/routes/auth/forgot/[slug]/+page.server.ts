export async function load({ params }) {
	return {
		token: params.slug
	};
}
