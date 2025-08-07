
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class SubscriptionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const subscriptions = await db.subscriptions.create(
            {
                id: data.id || undefined,

        plan: data.plan
        ||
        null
            ,

        status: data.status
        ||
        null
            ,

        start_date: data.start_date
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return subscriptions;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const subscriptionsData = data.map((item, index) => ({
                id: item.id || undefined,

                plan: item.plan
            ||
            null
            ,

                status: item.status
            ||
            null
            ,

                start_date: item.start_date
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const subscriptions = await db.subscriptions.bulkCreate(subscriptionsData, { transaction });

        return subscriptions;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const subscriptions = await db.subscriptions.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.plan !== undefined) updatePayload.plan = data.plan;

        if (data.status !== undefined) updatePayload.status = data.status;

        if (data.start_date !== undefined) updatePayload.start_date = data.start_date;

        updatePayload.updatedById = currentUser.id;

        await subscriptions.update(updatePayload, {transaction});

        return subscriptions;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const subscriptions = await db.subscriptions.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of subscriptions) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of subscriptions) {
                await record.destroy({transaction});
            }
        });

        return subscriptions;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const subscriptions = await db.subscriptions.findByPk(id, options);

        await subscriptions.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await subscriptions.destroy({
            transaction
        });

        return subscriptions;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const subscriptions = await db.subscriptions.findOne(
            { where },
            { transaction },
        );

        if (!subscriptions) {
            return subscriptions;
        }

        const output = subscriptions.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.status) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'subscriptions',
                            'status',
                            filter.status,
                        ),
                    };
                }

            if (filter.start_dateRange) {
                const [start, end] = filter.start_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    start_date: {
                    ...where.start_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    start_date: {
                    ...where.start_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.plan) {
                where = {
                    ...where,
                plan: filter.plan,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.subscriptions.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'subscriptions',
                        'plan',
                        query,
                    ),
                ],
            };
        }

        const records = await db.subscriptions.findAll({
            attributes: [ 'id', 'plan' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['plan', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.plan,
        }));
    }

};

