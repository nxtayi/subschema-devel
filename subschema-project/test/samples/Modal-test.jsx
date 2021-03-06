import React from 'react';
import {
    click,
    change,
    findNode,
    into,
    TestUtils,
    expect,
    byComponents,
    byTags,
    byComponent
}  from 'subschema-test-support';
import {newSubschemaContext} from 'subschema';
import {Modal} from 'subschema-test-samples';

function byId(node, id) {
    var all = TestUtils.findAllInRenderedTree(node, function (inst) {
        var inode = findNode(inst);
        if (inode == null) {
            return false;
        }
        return inode.id === id;
    });
    return all[0];
}

describe('subschema-test-samples/Modal', function () {
    this.timeout(50000);
    it('should render', function () {
        //loader, schema, Subschema, React
        const {valueManager,loader, Form} = newSubschemaContext();
        const ModalTemplate = loader.loadTemplate('ModalTemplate');

        const form = into(<Form schema={Modal.schema} valueManager={valueManager}/>, true);
        expect(form).toExist();


        let modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('modal should not show');
        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        expect(modal).toExist('Modal should show');

        let buttons = byTags(modal, 'button');
        expect(buttons.length).toBe(3, 'should have 3 buttons');
        click(buttons[0]);
        expect(valueManager.path('showAddressModal')).toBe(null, 'dismiss modal');

        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        let addr = byId(modal, 'address.street');
        change(addr, 'hello');
        buttons = byTags(modal, 'button');
        click(buttons[1]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address')).toBe(null, 'should revert change on cancel');

        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        addr = byId(modal, 'address.street');
        change(addr, 'hello2');
        buttons = byTags(modal, 'button');
        click(buttons[2]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toExist('hide');
        //change to validate.
        change(byId(form, 'address.zip'), '95130');
        click( byTags(modal, 'button')[2]);


        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address.street')).toBe('hello2', 'should commit change on save');


        valueManager.update('showAddressModal', true);
        modal = byComponent(form, ModalTemplate);
        addr = byId(modal, 'address.street');
        change(addr, 'hello3');
        buttons = byTags(modal, 'button');
        click(buttons[1]);
        modal = byComponents(form, ModalTemplate)[0];
        expect(modal).toNotExist('hide');
        expect(valueManager.path('address.street')).toBe('hello2', 'should revert change on cancel');

    });
});
