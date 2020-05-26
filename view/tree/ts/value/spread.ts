namespace $ {
	export class $mol_view_tree_ts_spread extends $mol_object2 {
		protected super_spread: $mol_tree | undefined = undefined

		constructor(
			$: $mol_ambient_context,
			protected prop_parts: $mol_view_tree_ts_prop
		) {
			super()
			this.$ = $
		}

		get(prop: $mol_tree) {
			const super_spread = this.super_spread
			if (super_spread) return this.$.$mol_fail(prop.error(
				`Only one \`^\` operator allowed, first was ${super_spread} at ${super_spread.row}:${super_spread.col}`
			))

			this.super_spread = prop.make_struct('inline', [
				prop.make_data('...super.'),
				this.$.$mol_view_tree_ts_function_call(this.prop_parts),
				prop.make_data(' ,'),
			])

			return this.super_spread
		}
	} 
}
