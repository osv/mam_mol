/** @jsx $mol_jsx_make */
namespace $ {
	
	$mol_test({
		
		'Make empty div'() {
			$mol_assert_equal( (<div/>).outerHTML , '<div></div>' )
		} ,
		
		'Define native field'() {
			
			const dom = <input value='123' /> as HTMLInputElement
			
			$mol_assert_equal( dom.outerHTML , '<input value="123">' )
			$mol_assert_equal( dom.value , '123' )

		} ,
		
		'Define classes'() {
			
			const dom = <div classList={[ 'foo bar' ]} />
			
			$mol_assert_equal( dom.outerHTML , '<div class="foo bar"></div>' )

		} ,
		
		'Define styles'() {
			
			const dom = <div style={{ color : 'red' }} />
			
			$mol_assert_equal( dom.outerHTML , '<div style="color: red;"></div>' )

		} ,
		
		'Define dataset'() {
			
			const dom = <div dataset={{ foo : 'bar' }} />
			
			$mol_assert_equal( dom.outerHTML , '<div data-foo="bar"></div>' )

		} ,
		
		'Define attributes'() {
			
			const dom = <div hidden lang="ru" />
			
			$mol_assert_equal( dom.outerHTML , '<div hidden="" lang="ru"></div>' )

		} ,
		
		'Define child nodes'() {

			const dom =
				<div>
					hello
					<strong>world</strong>
					!
				</div>
			
			$mol_assert_equal( dom.outerHTML , '<div>hello<strong>world</strong>!</div>' )

		} ,

		'Function as component'() {

			function Button( { id , ... props } : { id : string } , action : string , target : ()=> string ) {
				return <button { ... props } >{ action }{ target() }</button>
			}

			const dom = <Button id="/foo">click { ()=> 'me' }</Button>

			$mol_assert_equal( dom.outerHTML , '<button id="/foo">click me</button>' )
			
		} ,
		
		'Nested guid generation'() {

			function Foo( {} : { id? : string } ) {
				return <div>
					<Bar id="/bar">
						<img id="/icon" />
					</Bar>
				</div>
			}

			function Bar( props : { id? : string } , icon : Element ) {
				return <span>{ icon }</span>
			}

			const dom = <Foo id="/foo" />

			$mol_assert_equal( dom.outerHTML , '<div id="/foo"><span id="/foo/bar"><img id="/foo/icon"></span></div>' )
			
		} ,
		
		'Fail on non unique ids'() {

			function App() {
				return <div>
					<span id="/bar" />
					<span id="/bar" />
				</div>
			}

			$mol_assert_fail( ()=> <App id="/foo" /> , 'JSX already has tag with id "/bar"' )
			
		} ,
		
		'Attach to document'() {

			const doc = $mol_dom_parse( '<html><body id="/foo"></body></html>' )

			$mol_jsx_attach( doc , ()=> <body id="/foo">bar</body> )

			$mol_assert_equal( doc.documentElement.outerHTML , '<html><body id="/foo">bar</body></html>' )
			
		} ,
		
		async 'Reactive components'() {

			class Task {
				@ $mol_atom2_field title = 'foo'
			}

			class App {
				constructor( props : Partial< App > ) {
					this.props = props
					Object.assign( this , props )
					return this.render() as any
				}
				@ $mol_atom2_field props : Partial< App >
				id? : string
				task : Task
				@ $mol_atom2_prop
				render() { return <div>{ this.task.title }</div> }
			}

			const task = new Task

			let dom : Element 
			$mol_atom2_autorun( ()=> dom = <App id="/foo" task={ task } /> )
			
			await $mol_fiber_warp()
			$mol_assert_equal( dom.outerHTML , '<div id="/foo">foo</div>' )

			task.title = 'bar'
			await $mol_fiber_warp()
			$mol_assert_equal( dom.outerHTML , '<div id="/foo">bar</div>' )
			
		} ,
		
	})
	
}
