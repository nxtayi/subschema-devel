import {
    React,
    Form,
    ValueManager,
    check,
    intoWithState,
    into,
    byType,
    byTags,
    byComponent,
    byComponents,
    findNode,
    click,
    change,
    byTag,
    TestUtils,
    expect,
    Simulate
} from 'subschema-test-support';
import {types} from 'subschema-component-form';
const {Checkboxes, Checkbox} = types;
import newSubschemaContext from 'subschema-test-support/lib/newSubschemaContext';

describe('types/Checkboxes', function () {
    this.timeout(50000);
    it('should create checkboxes', function () {
        const {
            Form,
            context,
            valueManager
        } = newSubschemaContext();

        var root = into(<Form valueManager={valueManager} schema={{
            schema: {
                group1: {
                    options: ['one', 'two', 'three'],
                    type: 'Checkboxes'
                }

            }
        }}/>, true);
        expect(root).toExist('form should exist');
        const checkboxes = byTags(root, 'input');

        expect(checkboxes.length).toBe(3);
        const cb0 = checkboxes[0];
        expect(cb0).toExist();
        Simulate.change(cb0, {
            target: {
                checked: true,
                value: 'one'
            }
        });
//        change(cb0, 'one');
        expect(valueManager.path('group1.0')).toBe('one');

    });

    it('should create checkboxes in groups', function () {
        const {
            valueManager,
            context,
            Form
        } = newSubschemaContext();

        var root = into(<Form valueManager={valueManager} schema={{
            schema: {
                groupsOfGroups: {
                    title: 'Group of Groups',
                    options: [
                        {
                            group: 'North America', options: [
                            {val: 'ca', label: 'Canada'},
                            {val: 'us', label: 'United States'}
                        ]
                        },
                        {
                            group: 'Europe', options: [
                            {val: 'es', label: 'Spain'},
                            {val: 'fr', label: 'France'},
                            {val: 'uk', label: 'United Kingdom'}
                        ]
                        }
                    ],
                    type: 'Checkboxes'
                }


            }
        }}/>, true);
        expect(root).toExist('form should exist');
        const checkboxes = byTags(root, 'input');
        expect(checkboxes.length).toBe(5);
        expect(byTags(root, 'legend').length).toBe(2);
    });


});
