namespace $ {
	
	/** @deprecated */
	export let $mol_dict_key = $mol_key

	export class $mol_dict< Key , Value > extends Map< Key , Value > {

		get( key : Key ) {
			return super.get( $mol_key( key ) as any )
		}

		has( key : Key ) {
			return super.has( $mol_key( key ) as any )
		}

		set( key : Key , value : Value ) {
			return super.set( $mol_key( key ) as any , value )
		}

		delete( key : Key ) {
			return super.delete( $mol_key( key ) as any )
		}

		forEach( back : ( value : Value , key : Key , dict : Map< Key , Value > ) => void , context? : any ) {
			return super.forEach( ( val , key , dict )=> {
				if( typeof key === 'string' ) key = JSON.parse( key )
				return back.call( this , val , key , dict )
			} , context )
		}

		[Symbol.iterator]() {
			const iterator = super[ Symbol.iterator ]()
			
			return {
				[Symbol.iterator]() {
					return this
				},
				next() {
					const iteration = iterator.next()

					if( !iteration.done ) {
						const key = iteration.value[0]
						if( typeof key === 'string' ) iteration.value[0] = JSON.parse( key )
					}

					return iteration
				}
			}
		}

	}

}
