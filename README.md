## 基于 vue2 的虚拟滚动条

```bash
$ npm install scrollbar-vue2 --save
```

```bash
$ yarn add scrollbar-vue2
```

example
```bash
  <template>
   <div class="tag">
      <Scrollbar :always="true" class="scrollbar">
        <div class="tags" style="height: 200px">
          <div v-for="t in 800" :key="t">{{ t }}</div>
        </div>
      </Scrollbar>
    </div>
  </template>
  <script>
  import Scrollbar from "scrollbar-vue2";
  export default {
    components: { Scrollbar }
  }
  </script>
  <style lang="scss">
  .tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(116, 116, 116, 0.281);
    height: 100px;
    .scrollbar {
      width: 100%;
      .tags {
        display: flex;
        width: 1px;
      }
    }
  }
  </style>

```

### 参数说明

<table>
  <thead>
    <tr>
      <th>prop</th>
      <th>type</th>
      <th>description</th>
      <th>default</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>height</td>
    <td>[String, Number]</td>
    <td>滚动条的高度</td>
    <td>""</td>
  </tr>
  <tr>
    <td>maxHeight</td>
    <td>[String, Number]</td>
    <td>滚动条的最大高度</td>
    <td>""</td>
  </tr>
  <tr>
    <td>native</td>
    <td>Boolean</td>
    <td>是否使用原生滚动条</td>
    <td>false</td>
  </tr>
  <tr>
    <td>wrapStyle</td>
    <td>[String, Object, Array]</td>
    <td>wrap的样式</td>
    <td>""</td>
  </tr>
  <tr>
    <td>wrapClass</td>
    <td>[String, Array]</td>
    <td>wrap的Class</td>
    <td>""</td>
  </tr>
  <tr>
    <td>viewStyle</td>
    <td>[String, Array]</td>
    <td>view的样式</td>
    <td>""</td>
  </tr>
  <tr>
    <td>viewClass</td>
    <td>[String, Array]</td>
    <td>view的Class</td>
    <td>""</td>
  </tr>
  <tr>
    <td>noresize</td>
    <td>Boolean</td>
    <td>如果container尺寸不会发生变化,最好设置它可以优化性能</td>
    <td></td>
  </tr>
  <tr>
    <td>tag</td>
    <td>String</td>
    <td>元素tag</td>
    <td>div</td>
  </tr>
  <tr>
    <td>always</td>
    <td>Boolean</td>
    <td>总是显示滚动条</td>
    <td></td>
  </tr>
  <tr>
    <td>minSize</td>
    <td>Number</td>
    <td>滚动条的最小尺寸</td>
    <td>20</td>
  </tr>
  </tbody>
</table>
