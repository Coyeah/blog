---
title: antd探秘之Form篇
date: "2020-03-27T10:07:15.000Z"
description: 
---

阅读 antd Form 源码笔记记录

## Begin

从 `Form.create` 开始。实际 create 方法是调用 `rc-form/lib/createDOMForm`，这个库是 antd 的方法库，也是由阿里维护。

```tsx
// [ant-design] components/form/Form.tsx

static create = function create<TOwnProps extends FormComponentProps>(
    options: FormCreateOption<TOwnProps> = {},
  ): FormWrappedProps<TOwnProps> {
    return createDOMForm({
      fieldNameProp: 'id',
      ...options,
      fieldMetaProp: FIELD_META_PROP,
      fieldDataProp: FIELD_DATA_PROP,
    });
  };

// [rc-form] src/createDOMForm.js

function createDOMForm(option) {
  return createBaseForm({
    ...option,
  }, [mixin]);
}
```

转战 `createBaseForm`，七百多行的代码，一点一点解析，发现了好多好玩的，其中很多方法都和 Form 中的方法是一样的，熟悉了 Form 的使用方法，看起来相对没那么困难，我是对照着 [Form 官方文档](https://3x.ant.design/components/form-cn/#API)来慢慢解析的。

```tsx
function createBaseForm (...) {
  return function decorate (...) {
    const Form = createReactClass({ ... });
    return Form;
  }
}
```

简化代码，不难发现这是一个高阶组件，是对业务组件的一层封装。

## 解读 createFieldsStore

 `FieldsStore` （src/createFieldsStore.js） 是对数据进行持久化处理的。fieldMeta（数据元）是用于存储单个字段数据的载体对象。该类里的其他方法都是基于数据的 get & set；在 store 中是存储分别是：`fields`  & `fieldsMeta` 对象，前者是初始化生成的，是后期操作存储的。

初始对传入数据进行 `internalFlattenFields` 对数组进行处理。这个处理简单而有精妙，简单是在于很好理解，就是平铺嵌套的逻辑；精妙是在于代码设计上，需要细看与理解。

```tsx
function internalFlattenFields(fields) {
  return flattenFields(
    fields,
    (_, node) => isFormField(node),
    'You must wrap field data with `createFormField`.'
  );
}

export function treeTraverse(path = '', tree, isLeafNode, errorMessage, callback) {
  if (isLeafNode(path, tree)) {
    callback(path, tree);
  } else if (tree === undefined || tree === null) {
    // Do nothing
  } else if (Array.isArray(tree)) {
    tree.forEach((subTree, index) => treeTraverse(
      `${path}[${index}]`,
      subTree,
      isLeafNode,
      errorMessage,
      callback
    ));
  } else { // It's object and not a leaf node
    if (typeof tree !== 'object') {
      warning(false, errorMessage);
      return;
    }
    Object.keys(tree).forEach(subTreeKey => {
      const subTree = tree[subTreeKey];
      treeTraverse(
        `${path}${path ? '.' : ''}${subTreeKey}`,
        subTree,
        isLeafNode,
        errorMessage,
        callback
      );
    });
  }
}

export function flattenFields(maybeNestedFields, isLeafNode, errorMessage) {
  const fields = {};
  treeTraverse(undefined, maybeNestedFields, isLeafNode, errorMessage, (path, node) => {
    fields[path] = node;
  });
  return fields;
}
```

`(_, node) => isFormField(node)` 这里的关键需要回溯到 createBaseForm 时传入的 mapPropsToFields 对所有字段数据用 Field 构建了一遍。

### getValidFieldsName

获取所有有效的字段名称。

### getValidFieldsFullName

获取完整的字段名称。倘若 name 设置为 `a.b` 或 `a[b]` 的时候，会形成嵌套的对象形式。通过 `getValidFieldsName` 获取所有字段名称逐个遍历，`startsWith(fullName, partialName) && ['.', '['].indexOf(fullName[partialName.length]) >= 0`，提取出完全匹配和嵌套匹配的字段。

### getNestedFields & getNestedField

获取嵌套资源，关键在于这句 `fields.reduce((acc, f) => set(acc, f, getter(f)), {});`，需要理解代码嵌套的逻辑，返回的是一个对象，key值为字段名称，value则是对应的数据；

而 `getNestedField` 则需要截去嵌套的父级；

### setFields

已有字段列表和传入的字段列表合并，从每个字段元里调用 `getValueFormFields` 获取新的 value，放入字段对象中，存入 `this.fields`。

### getValueFromFields

从 fieldMeta 中获取 value 值，若不存在则获取 initialValue。

## 解读 createBaseForm

从一些函数方法开始：

### getFieldProps（获取字段属性）

```tsx
// 1、结合传入的 option 组装成新的 field option
const fieldOption = {
  name,
  trigger: DEFAULT_TRIGGER,
  valuePropName: 'value',
  validate: [],
  ...usersFieldOption,
};
// 2、获取存储在 store 中的字段元
const fieldMeta = this.fieldsStore.getFieldMeta(name);
// 3、组装组件所需的属性
const inputProps = {
  ...this.fieldsStore.getFieldValuePropValue(fieldOption),
  ref: this.getCacheBind(name, `${name}__ref`, this.saveRef),
};
// 4、规范化校验规则，数组内容：数据 + 触发函数标识（如 onChange）
const validateRules = normalizeValidateRules(
  validate,
  rules,
  validateTrigger,
);
// 5、对 Trigger 封装一层 onCollect 与 bind(this)
/*
		onCollect 从 store 中获取的 action 函数且调用；#2001
		setFieldsAsDirty 会把所有的字段添加一个 dirty: true；
		validateFieldsInternal 来校验字段；#2002
 */
const validateTriggers = getValidateTriggers(validateRules);
validateTriggers.forEach(action => {
  if (inputProps[action]) return;
  inputProps[action] = this.getCacheBind(
    name,
    action,
    this.onCollectValidate,
  );
});
// 6、更新字段元
this.fieldsStore.setFieldMeta(name, {
  ...fieldMeta,
  ...fieldOption,
  validate: validateRules,
});
```

### getFieldDecorator（获取进过装饰器的组件实例）

这个函数很常见了，使用 antd Form 的必定会使用到的。

```tsx
// 1、获取处理过的 props
const props = this.getFieldProps(name, fieldOption);
// 2、返回一个 React.FC
return fieldElem => {
  /*
  		中间做过一些处理：
  		获取字段元、记录原始 props 和 ref。
   */
  return React.cloneElement(fieldElem, {
    ...props,
    ...this.fieldsStore.getFieldValuePropValue(fieldMeta),
  });
};

```

## 一些函数的补充解读

### #2001 onCollect 及相关函数

onCollect 是对组件的 action 函数封装，分别有 `onCollectCommon`、`onCollect`、`onCollectValidate`。

+ onCollectCommon：触发组件的 action 函数；
+ onCollect & onCollectValidate：触发，设置字段 dirty 为 true，唯一不同的是 `onCollectValidate` 会进行 validateFieldsInternal 检验字段；而 `onCollect` 会判断字段 hasRules 来设置 dirty；

### #2002 validateFieldsInternal（校验内部字段）

1、遍历 fields，记录 `rules`、`value`、`field`，添加 `validating` 和 `dirty` 为 true 的字段。若字段的 `force !== true && dirty === false` 且 error，记录到 `alreadyErrors`；

2、调用this.setFields；调用了 `fieldsStore.setFields`；

3、in case normalize. 从 store 中获取 value 更新记录；

4、运用了 `async-validator` 库，校验和错误处理；这就是为什么在 Form.Item 输入完以后会触发校验；

## utils.js 中使用的函数解读记录

+ normalizeValidateRules（规范验证规则）：生成新的校验规则；遍历 `validate`，`trigger` 提取并用数组包装；为添加触发函数标示，用数组的形式；
+ getValidateTriggers（获取校验触发函数）：通过 filter > map > reduce 获取一个触发函数的数组；

## 小结

对于 Form.create 解读并不算特别细致，主要是对在 Form 组件中常用的函数进行解读，各种还有很多隐藏的使用并没有进行细致的挖掘，例如 `validating`、`dirty` 等，这些属性的具体使用场景是什么，后期慢慢进行补充。从中学习到更多的是，写代码的方式方法。在看看 git 的提交记录，都是三四年前的记录了。证明我的水平还是需要继续加强学习和记录。

当中问题，欢迎大家斧正和交流。

