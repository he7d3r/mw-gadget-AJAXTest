/**
 * Baseado em [[w:en:Wikipedia:WikiProject_User_scripts/Guide/Ajax#Edit_a_page_and_other_common_actions]]
 * MediaWiki ajax.js
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 */
/*jshint browser: true, devel: true, camelcase: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, trailing: true, maxlen: 120, evil: true, onevar: true */
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

function editPage( info ) {
	// Edit page (must be done through POST)
        $.ajax({
                url: mw.util.wikiScript( 'api' ),
                type: 'POST',
                dataType: 'json',
                data: {
                        format: 'json',
                        action: 'edit',
                        title: info.title,
                        text: info.text,
                        summary: info.summary,
                        token: mw.user.tokens.get( 'editToken' )
                },
                success: function( data ) {
                        if ( data && data.edit && data.edit.result && data.edit.result === 'Success' ) {
                                alert( 'Page edited!' );
                        } else {
                                alert( 'The edit query returned an error. =(' );
                        }
                },
                error: function() {
                        alert( 'The ajax request failed.' );
                }
        });
}
function getTextFromSpecialBook() {
	var	bookName = $( '#titleInput' ).val(),
		text = ';(Este seria o índice criado para o livro "' +
			bookName + '")\n\n== Índice ==\n* [[/',
		$chapters = $( '#collectionList' ).find( 'strong' ),
		list = [];

	if ( !$chapters.length ) {
		alert( 'É preciso definir os nomes dos capítulos!' );
		return;
	}
	$chapters.each( function( ){
		list.push( $( this ).text() );
	} );
	text += list.join( '/]] [[Imagem:00%.svg]]\n* [[/' ) +
		'/]] [[Imagem:00%.svg]]\n\n{' +
		'{Fases5}}\n{' + '{AutoCat}}\n{' +
		'{Ordem alfabética|' + bookName.substr(0,1) + '}}';
	return text;
}

if ( mw.config.get('wgCanonicalSpecialPageName') === 'Book' ) {
	$(function () {
		$( mw.util.addPortletLink(
			'p-cactions',
			'#',
			'Criar livro (AJAX)',
			'ca-ajax-edit'
		)).click( function( e ) {
			e.preventDefault();
			editPage({
				title: 'User:' + mw.config.get('wgUserName') + '/AJAX',
				text: getTextFromSpecialBook(),
				summary: 'Trying to edit my sandbox using AJAX...'
			});
		});
	});
}

}( mediaWiki, jQuery ) );