<script lang="ts">
	import type { PageData } from './$types';
	import chromium from 'chrome-aws-lambda';
	export let data: PageData;
	chromium.executablePath.then((value) => console.log('BREAKPOINT', value));
</script>

{JSON.stringify(data.content)}
