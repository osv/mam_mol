namespace $ {

	export class $mol_wire_fiber_persist<
		Host,
		Args extends readonly unknown[],
		Result,
	> extends $mol_wire_fiber< Host, Args, Result > {

		static getter<
			Host,
			Args extends readonly unknown[],
			Result,
		>(
			task: ( this : Host , ... args : Args )=> Result,
			keys: number,
		): ( host: Host, args: Args )=> $mol_wire_fiber_persist< Host, [ ... Args ], Result > {
			
			const field = task.name + '()'
			
			if( keys ) {
				
				return function $mol_wire_fiber_persist_get( host: Host, args: Args ) {
					
					let dict, key!: string, fiber
					
					key = `${ host?.[ Symbol.toStringTag ] ?? host }.${ task.name }(${ args.map( v => $mol_key( v ) ).join(',') })`
					dict = Object.getOwnPropertyDescriptor( host ?? task, field )?.value
					
					if( dict ) {
						const existen = dict.get( key )
						if( existen ) return existen
					} else {
						dict = ( host ?? task )[ field ] = new Map<any,any>()
					}
					
					fiber = new $mol_wire_fiber_persist( key, task, host, ... args )
					dict.set( key, fiber )
					
					return fiber
				}
				
			} else {
				
				return function $mol_wire_fiber_persist_get( host: Host, args: Args ) {
					
					const existen = Object.getOwnPropertyDescriptor( host ?? task, field )?.value
					if( existen ) return existen
					
					const key = `${ host?.[ Symbol.toStringTag ] ?? host }.${ field }`
					
					const fiber = new $mol_wire_fiber_persist( key, task, host, ... args )
					;( host ?? task )[ field ] = fiber
					
					return fiber
				}
				
			}
			
		}
		
		/**
		 * Update fiber value through another temp fiber.
		 */
		@ $mol_wire_method
		recall( ... args: Args ) {
			
			if( this.cursor > $mol_wire_cursor.fresh ) {
				try {
					this.once()
				} catch( error: unknown ) {
					if( error instanceof Promise ) $mol_fail_hidden( error )
				}
			}
			
			return this.put( this.task.call( this.host!, ... args ) )
			
		}
		
		@ $mol_wire_method
		once() {
			return this.sync()
		}
		
		destructor() {
			
			super.destructor()
			
			const prev = this.cache
			if( $mol_owning_check( this, prev ) ) {
				prev.destructor()
			}
			
			if( this.pub_from === 0 ) {
				;( this.host ?? this.task )[ this.field() ] = null
			} else {
				;( this.host ?? this.task )[ this.field() ].delete( this[ Symbol.toStringTag ] )
			}
			
		}
		
	}
	
}
