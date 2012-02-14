/**
 * Baseado em [[w:en:Wikipedia:WikiProject_User_scripts/Guide/Ajax#Edit_a_page_and_other_common_actions]]
 * MediaWiki ajax.js
 */
if ( 'Especial:Livro' === mw.config.get( 'wgPageName' ) ) {
	$(function () {
		$( mw.util.addPortletLink(
			'p-cactions',
			'#',
			'Criar livro (AJAX)',
			'ca-ajax-edit'
		)).click( function( e ) {
			e.preventDefault();
			editar();
		});
	});
}

function editar() {
	// Edit page (must be done through POST)
	function editPage( token ) {
		var	nomedolivro = $( '#titleInput' ).val(),
			texto = ';(Este seria o índice criado para o livro "' +
				nomedolivro + '")\n\n== Índice ==\n* [[/',
			pagina = 'User:Helder.wiki/AJAX',
			$caps = $( '#collectionList' ).find( 'strong' ),
			list = [];

		if ( !$caps.length ) {
			alert( 'É preciso definir os nomes dos capítulos!' );
			return;
		}
		$caps.each( function( ){
			list.push( $( this ).text() );
		} );
		texto += list.join( '/]] [[Imagem:00%.svg]]\n* [[/' ) + '/]] [[Imagem:00%.svg]]\n\n{' +
			'{Fases5}}\n{' + '{AutoCat}}\n{' + '{Ordem alfabética|' + nomedolivro.substr(0,1) + '}}';

		$.post(
			mw.util.wikiScript( 'api' ), {
				action: 'edit',
				title: pagina,
				text: texto,
				summary: 'Trying to edit my sandbox using AJAX...',
				token: token
			},
			function() {
				alert( 'A página foi editada.' );
			}
		).error(function() {
			alert( 'Não foi possível editar a página. =(' );
		});
	}
	// Get the token and then edit the page
	$.getJSON(
		mw.util.wikiScript( 'api' ), {
			format: 'json',
			action: 'query',
			prop: 'info',
			indexpageids: '1',
			intoken: 'edit',
			titles: 'Whatever'
		},
		function( data ) {
			var token = data.query.pages[ data.query.pageids[0] ].edittoken;
			editPage(token);
		}
	).error(function() {
		alert( 'Houve um erro ao solicitar um token. =(' );
	});
}//editar