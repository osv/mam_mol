# $mol_list

## [Online demo](https://mol.hyoo.ru/#!section=demos/readme/demo=mol_list_demo)

The list of rows with lazy rendering support based on `minimal_height` of rows. 

## Usage example

```
<= Users $mol_list
	rows /
		<= User_1 $mol_view
		<= User_2 $mol_view
		<= User_3 $mol_view
```

## Properties

`rows() : []`

Returns list of rows.
