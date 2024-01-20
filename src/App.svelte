<script lang="ts">
  let tables: {
    name: string

    cols: {
      name: string
      type: string
    }[]
  }[] = []
  let nowTableIndex: number | null = null
  const acsess = async () => {
    const res = await fetch(`/tables`)
    tables = (await res.json()).map((name: string) => ({
      name,
      cols: [],
    }))
  }
  const loadTable = async (index: number) => {
    const table = tables[index]

    const cols = await fetch(`/col-names?table=${encodeURIComponent(table.name)}`).then(res => res.json())
    table.cols = cols.map((data: any) => ({
      name: data.column_name,
      type: data.data_type
    }))

    //const datas = await fetch(`/all-datas?table=${encodeURIComponent(table.name)}`).then(res => res.json())
    tables[index] = table

    nowTableIndex = index
  }
</script>
<main>
  <button on:click={acsess} class="bg-blue-300 p-2 rounded-lg m-2">
    Acsess
  </button>
  <div class="flex h-[100dvh]">
    <div class="flex flex-col gap-4 h-full">
      {#each tables as table, index}
        <div>
          <button on:click={() => loadTable(index)} class="underline hover:no-underline">{table.name}</button>
        </div>
      {/each}
    </div>
    <div>
      {#if nowTableIndex}
        <table>
          <thead>
            <tr>
              {#each tables[nowTableIndex].cols as col}
                <td>
                  <div class="font-bold">{ col.name }</div>
                  <div class="text-slate-500">{ col.type }</div>
                </td>
              {/each}
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</main>