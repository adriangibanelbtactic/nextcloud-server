/*
 * @copyright Copyright (c) 2024 Fon E. Noel NFEBE <me@nfebe.com>
 *
 * @author Fon E. Noel NFEBE <me@nfebe.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Vue from 'vue'

import { getRequestToken } from '@nextcloud/auth'
import { emit } from '@nextcloud/event-bus'
import { translate, translatePlural } from '@nextcloud/l10n'
import { generateFilePath, imagePath } from '@nextcloud/router'

import '@nextcloud/dialogs/style.css'

(function(OC: any, OCP: any, t: any, n: any) {

	/**
	 *
	 */
	function init() {
		if (!OCP.UnifiedSearch) {
			return
		}
		console.debug('Initializing unified search plugin: folder search from files app')
		OCP.UnifiedSearch.registerFilterAction({
			id: 'talk-message',
            appId: 'files',
			label: t('files', 'In Folder'),
			icon: imagePath('files', 'app.svg'),
			callback: () => {
				const container = document.createElement('div')
				container.id = 'files-unified-search-folder-select'
				const body = document.getElementById('body-user')
				body.appendChild(container)

				const FolderSelector = () => import('./views/FolderReferencePicker.vue')
				const vm = new Vue({
					el: container,
					render: h => h(FolderSelector, {
						props: {
							providerId: '',
							accessible: true,
						},
					}),
				})

				// vm.$root.$on('close', () => {
				// 	vm.$el.remove()
				// 	vm.$destroy()
				// })
				// vm.$root.$on('select', (folder: any) => {
				// 	vm.$el.remove()
				// 	vm.$destroy()

				// 	emit('nextcloud:unified-search:add-filter', {
				// 		id: 'talk-message',
				// 		payload: folder,
				// 		filterUpdateText: t('files', 'Search in folder: {folder}', { folder: folder.displayName }),
				// 		filterParams: { folder: folder.token }
				// 	})
				// })
			},
		})
	}

	// CSP config for webpack dynamic chunk loading
	// eslint-disable-next-line
	__webpack_nonce__ = btoa(getRequestToken())

	// Correct the root of the app for chunk loading
	// OC.linkTo matches the apps folders
	// OC.generateUrl ensure the index.php (or not)
	// We do not want the index.php since we're loading files
	// eslint-disable-next-line
	__webpack_public_path__ = generateFilePath('files', '', 'js/')

	Vue.prototype.t = translate
	Vue.prototype.n = translatePlural
	Vue.prototype.OC = OC
	Vue.prototype.OCP = OCP

	document.addEventListener('DOMContentLoaded', init)

})(window.OC, window.OCP, t, n)
