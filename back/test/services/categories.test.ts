import * as assert from 'assert';

import app from '../../src/app';


describe('\'categories\' service', function () {

    describe('Categories CRUD', async function () {
        it('Test categories.create && categories.patch', async () => {
            const category = await app.service('categories').create({
                name: 'Материал',
                subcategories: [
                    {
                        name: 'Шлифовка',
                        difficulty: 3
                    }, {
                        name: 'поручка',
                        difficulty: 4
                    }
                ]
            });
            const subcategoriesModel = app.get('sequelizeClient').models.subcategories;
            const categoryId = await app.service('categories').get(category.id);
            const subCategoryIds = await subcategoriesModel.findAll({raw: true});

            assert.strictEqual(category.id, categoryId.id, 'Data was created in categories table');
            assert.strictEqual(subCategoryIds.length, 2, 'Date in subcategories equal to created data');

            const updatedCategory = await app.service('categories').patch(category.id, {
                name: 'Наждачка',
                subcategories: [
                    {
                        id: subCategoryIds[0].id,
                        name: 'Шлифовка',
                        difficulty: 5
                    }, {
                        id: subCategoryIds[1].id,
                        name: 'Шлифовка',
                        difficulty: 6
                    }
                ]
            });
            const updatedSubcategory = await subcategoriesModel.findAll({raw: true});

            assert.strictEqual(updatedCategory.name, 'Наждачка', 'Data in the category was not updated');
            assert.strictEqual(updatedSubcategory[0].difficulty, 5, 'Data in the first subcategory was not updated');
            assert.strictEqual(updatedSubcategory[1].difficulty, 6, 'Data in the second subcategory was not updated');
            assert.strictEqual(category.id, updatedSubcategory[0].category_id, 'The foreign key of the first subcategory is not the same as the category key');
            assert.strictEqual(category.id, updatedSubcategory[1].category_id, 'The foreign key of the second subcategory is not the same as the category key');

        });

        it('Test categories.remove', async () => {
            const category = await app.service('categories').create({
                name: 'Материал',
                subcategories: [
                    {
                        name: 'Шлифовка',
                        difficulty: 3
                    }, {
                        name: 'поручка',
                        difficulty: 4
                    }
                ]
            });
            const subcategoriesModel = app.get('sequelizeClient').models.subcategories;
            const categoryId = await app.service('categories').get(category.id);
            const subCategoryIds = await subcategoriesModel.findAll({raw: true});

            assert.strictEqual(category.id, categoryId.id, 'Data was created in categories table');
            assert.strictEqual(subCategoryIds.length, 2, 'Date in subcategories equal to created data');

            await app.service('categories').remove(category.id);
            const deletedCategory = await app.service('categories').find({query: {id: category.id}});
            const deletedSubcategories = await subcategoriesModel.findAll({raw: true});

            assert.strictEqual(deletedCategory.total, 0, 'Data was not deleted in categories table');
            assert.strictEqual(deletedSubcategories.length, 0, 'Data was not deleted in subcategories table');
        });
    });

});
